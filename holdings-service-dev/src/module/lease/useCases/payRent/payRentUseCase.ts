import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
  NotFoundError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { LeaseRepo, LEASE_REPO } from '../../repos/lease.repo';
import { Lease, LeaseStatus } from '../../domain/lease';
import { PayRentDTO } from './payRentDTO';
import { FetchFromSourceUseCase } from 'src/module/asset/useCases/fetchFromSource/fetchFromSourceUseCase';
import { WSGateway } from 'src/module/ws/wsGateway';

type Response = Either<
  DomainModelCreationError | UnexpectedError | NotFoundError,
  Result<Lease>
>;

@Injectable()
export class PayRentUseCase {
  constructor(
    @Inject(LEASE_REPO) private leaseRepo: LeaseRepo,
    private fetchFromSourceUseCase: FetchFromSourceUseCase,
    private wsGateway: WSGateway,
  ) {}
  private readonly logger = new Logger(PayRentUseCase.name);
  public async exec(body: PayRentDTO): Promise<Response> {
    try {
      this.logger.log(`PayRent body ${JSON.stringify(body)}`);

      const { contractAddress, tokenId, monthsPaid } = body;

      const updatedLease = await this.leaseRepo.updateLease(
        contractAddress,
        { tokenId, status: LeaseStatus['LEASED'] },
        {
          monthsPaid,
        },
      );

      if (!updatedLease) {
        throw new Error('Lease does not exist for asset, cannot be updated.');
      }

      // let it do in the background
      this.fetchFromSourceUseCase.exec(contractAddress, tokenId);

      this.logger.log(`PayRent lease ${JSON.stringify(updatedLease)}`);

      this.wsGateway.sendToRoom('RentPaid', updatedLease.lessee);
      return right(Result.ok<Lease>(updatedLease));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
