import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { LeaseRepo, LEASE_REPO } from '../../repos/lease.repo';
import { Lease, LeaseStatus } from '../../domain/lease';
import { WSGateway } from 'src/module/ws/wsGateway';
import { FetchFromSourceUseCase } from 'src/module/asset/useCases/fetchFromSource/fetchFromSourceUseCase';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Lease>
>;

interface IAcceptLease {
  lessee: string;
  tokenId: string;
  finalLeaseLength: number;
  contractAddress: string;
  timestamp: Date;
}
@Injectable()
export class AcceptLeaseUseCase {
  private readonly logger = new Logger(AcceptLeaseUseCase.name);
  constructor(
    @Inject(LEASE_REPO) private leaseRepo: LeaseRepo,
    private fetchFromSourceUseCase: FetchFromSourceUseCase,
    private wsGateway: WSGateway,
  ) {}

  public async exec(body: IAcceptLease): Promise<Response> {
    try {
      this.logger.log(`AcceptLease`);

      const { tokenId, lessee, finalLeaseLength, contractAddress, timestamp } =
        body;

      const updatedLease = await this.leaseRepo.updateLease(
        contractAddress,
        { tokenId, status: LeaseStatus['OPEN'] },
        {
          lessee,
          finalLeaseLength,
          monthsPaid: 1,
          status: LeaseStatus['LEASED'],
          dateSigned: timestamp,
        },
      );

      if (!updatedLease) {
        throw new Error('Lease does not exist for asset, cannot be updated.');
      }

      // let it do in the background
      this.fetchFromSourceUseCase.exec(contractAddress, tokenId);

      this.logger.log(`AcceptLease lease ${JSON.stringify(updatedLease)}`);

      this.wsGateway.sendToRoom('LeaseAccepted', updatedLease.lessee);
      return right(Result.ok<Lease>(updatedLease));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
