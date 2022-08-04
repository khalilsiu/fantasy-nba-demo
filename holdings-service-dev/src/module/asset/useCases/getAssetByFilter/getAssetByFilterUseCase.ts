import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
  NotFoundError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Asset } from '../../domain/asset';
import { AssetRepo, ASSET_REPO } from '../../repos/asset.repo';
import { TraitFilter } from './getAssetByFilterDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError | NotFoundError,
  Result<Asset[]>
>;

interface IGetAssetByFilterUseCase {
  address: string;
  tokenIds?: string[];
  traitFilter?: TraitFilter[];
  floor?: boolean;
}

@Injectable()
export class GetAssetByFilterUseCase {
  constructor(@Inject(ASSET_REPO) private assetRepo: AssetRepo) {}
  private readonly logger = new Logger(GetAssetByFilterUseCase.name);
  public async exec({
    address,
    tokenIds,
    traitFilter,
    floor,
  }: IGetAssetByFilterUseCase): Promise<Response> {
    try {
      this.logger.log(`GetAssetByFilter`);

      const assets = await this.assetRepo.find(
        address,
        {
          tokenIds,
          traits: traitFilter,
        },
        {
          floor,
        },
      );

      if (!assets.length) {
        this.logger.error(
          `GetAssetByFilter getAsset error asset cannot be found`,
        );
        return left(
          new NotFoundError(`GetAssetByFilter getAsset asset cannot be found`),
        );
      }

      this.logger.log(
        `GetAssetByFilter asset filtered ${JSON.stringify(assets)}`,
      );

      return right(Result.ok<Asset[]>(assets));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
