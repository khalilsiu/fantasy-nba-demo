import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { LeaseRepo, LEASE_REPO } from '../../repos/lease.repo';
import { Lease, LeaseStatus } from '../../domain/lease';
import { CancelLeaseDTO } from './cancelLeaseDTO';
import { WSGateway } from 'src/module/ws/wsGateway';
import { UpsertLeaseUseCase } from '../upsertLease/upsertLeaseUseCase';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Lease>
>;

@Injectable()
export class CancelLeaseUseCase {
  private readonly logger = new Logger(CancelLeaseUseCase.name);
  constructor(
    @Inject(LEASE_REPO) private leaseRepo: LeaseRepo,
    private upsertLeaseUseCase: UpsertLeaseUseCase,
    private wsGateway: WSGateway,
  ) {}

  public async exec(body: CancelLeaseDTO): Promise<Response> {
    try {
      this.logger.log(`CancelLease`);

      const { tokenId, regenerate, contractAddress } = body;

      const cancelledLease = await this.leaseRepo.updateLease(
        contractAddress,
        {
          tokenId,
          status: LeaseStatus.LEASED,
        },
        {
          status: LeaseStatus['CANCELLED'],
        },
      );

      if (!cancelledLease) {
        throw new Error('Lease does not exist for asset, cannot be updated.');
      }

      const {
        rentAmount,
        deposit,
        gracePeriod,
        minLeaseLength,
        maxLeaseLength,
        rentToken,
        autoRegenerate,
        lessor,
      } = cancelledLease;

      if (regenerate) {
        const result = await this.upsertLeaseUseCase.exec({
          tokenId,
          contractAddress,
          rentAmount,
          deposit,
          gracePeriod,
          minLeaseLength,
          maxLeaseLength,
          rentToken,
          autoRegenerate,
          lessor,
        });
        if (result.isLeft()) {
          return left(result.value);
        }
      }

      this.logger.log(
        `CancelLease lease ${JSON.stringify(
          cancelledLease,
        )} autoRegenerate ${autoRegenerate}`,
      );

      this.wsGateway.sendToRoom('LeaseCancelled', cancelledLease.lessee);
      return right(Result.ok<Lease>(cancelledLease));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
