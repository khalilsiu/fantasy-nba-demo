import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenSeaService } from 'src/module/opensea/OpenSeaService';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Asset } from '../../domain/asset';
import { AssetRepo, ASSET_REPO } from '../../repos/asset.repo';
import { preprocessAsset } from '../../asset.utils';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

@Injectable()
export class FetchFromSourceUseCase {
  constructor(@Inject(ASSET_REPO) private assetRepo: AssetRepo) {}
  private readonly logger = new Logger(FetchFromSourceUseCase.name);
  public async exec(address: string, tokenId: string): Promise<Response> {
    try {
      this.logger.log(`fetchFromSource`);

      const assetResponse = await OpenSeaService.fetchAsset(address, tokenId);

      const props = preprocessAsset(assetResponse, address);

      const assetObjectOrError = await Asset.create({
        ...props,
        updatedAt: new Date(),
      });
      if (assetObjectOrError.isFailure) {
        return left(
          new DomainModelCreationError(assetObjectOrError.error.toString()),
        );
      }

      const asset = assetObjectOrError.getValue();

      this.logger.log(`fetchFromSource before create`);
      await this.assetRepo.bulkUpsertAsset([asset]);
      this.logger.log(`fetchFromSource successfully created`);
      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
