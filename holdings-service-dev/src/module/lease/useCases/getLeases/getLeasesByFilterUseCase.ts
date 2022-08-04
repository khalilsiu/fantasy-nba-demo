import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
  NotFoundError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { LeaseRepo, LEASE_REPO } from '../../repos/lease.repo';
import { Lease } from '../../domain/lease';
import { GetLeaseDTO } from './getLeasesByFilterDTO';
import { GetAssetByFilterUseCase } from 'src/module/asset/useCases/getAssetByFilter/getAssetByFilterUseCase';
import { keyBy } from 'lodash';
import { Asset } from 'src/module/asset/domain/asset';

type Response = Either<
  DomainModelCreationError | UnexpectedError | NotFoundError,
  Result<AssetWithLease[]>
>;

export class AssetWithLease extends Asset {
  lease: Lease;
}

@Injectable()
export class GetLeasesByFilterUseCase {
  constructor(
    @Inject(LEASE_REPO) private leaseRepo: LeaseRepo,
    private getAssetByFilterUseCase: GetAssetByFilterUseCase,
  ) {}
  private readonly logger = new Logger(GetLeasesByFilterUseCase.name);
  public async exec(body: GetLeaseDTO): Promise<Response> {
    try {
      this.logger.log(`GetLeases body ${JSON.stringify(body)}`);

      const {
        contractAddress,
        lessor,
        lessee,
        tokenIds,
        status,
        finalLeaseLength,
        isRentOverdue,
        sort,
      } = body;

      const leases = await this.leaseRepo.find(
        contractAddress,
        {
          lessor,
          lessee,
          tokenIds,
          status,
          finalLeaseLength,
          isRentOverdue,
        },
        { sort },
      );

      const assetsOrError = await this.getAssetByFilterUseCase.exec({
        address: body.contractAddress,
        tokenIds: leases.map((lease) => lease.tokenId),
      });

      if (assetsOrError.isLeft()) {
        const error = assetsOrError.value;
        this.logger.error(
          `getLeasesByFilterUseCase getAssetsByFilter error ${JSON.stringify(
            error,
          )}`,
        );
        return right(Result.ok<AssetWithLease[]>([]));
      }

      const assetsMap = keyBy(
        assetsOrError.value.getValue(),
        (asset: Asset) => `${asset.address}_${asset.tokenId}`,
      );
      const returned = leases.reduce((acc, lease) => {
        const key = `${lease.contractAddress}_${lease.tokenId}`;
        if (assetsMap[key]) {
          acc.push({
            ...assetsMap[key],
            lease,
          });
        }
        return acc;
      }, []);

      this.logger.log(
        `GetLeasesByFilter leases filtered ${JSON.stringify(leases)}`,
      );

      return right(Result.ok<AssetWithLease[]>(returned));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
