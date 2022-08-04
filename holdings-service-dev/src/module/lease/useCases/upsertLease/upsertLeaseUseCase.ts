import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { LeaseRepo, LEASE_REPO } from '../../repos/lease.repo';
import { Lease, LeaseStatus } from '../../domain/lease';
import { UpsertLeaseDTO } from './upsertLeaseDTO';
import { WSGateway } from 'src/module/ws/wsGateway';
import { FetchFromSourceUseCase } from 'src/module/asset/useCases/fetchFromSource/fetchFromSourceUseCase';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Lease>
>;
@Injectable()
export class UpsertLeaseUseCase {
  private readonly logger = new Logger(UpsertLeaseUseCase.name);
  constructor(
    @Inject(LEASE_REPO) private leaseRepo: LeaseRepo,
    private fetchFromSourceUseCase: FetchFromSourceUseCase,
    private wsGateway: WSGateway,
  ) {}

  public async exec(body: UpsertLeaseDTO): Promise<Response> {
    try {
      this.logger.log(`UpsertLease`);

      const { tokenId, contractAddress, ...rest } = body;

      const address = contractAddress.toLowerCase();

      const upsertedLease = await this.leaseRepo.upsertLease(address, tokenId, {
        ...rest,
        status: LeaseStatus['OPEN'],
        lessee: '0x0000000000000000000000000000000000000000',
        monthsPaid: 0,
      });

      // let it do in the background
      this.fetchFromSourceUseCase.exec(address, tokenId);

      this.logger.log(`UpsertLease lease ${JSON.stringify(upsertedLease)}`);

      this.wsGateway.sendToRoom('LeaseCreated', upsertedLease.lessor);
      return right(Result.ok<Lease>(upsertedLease));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
