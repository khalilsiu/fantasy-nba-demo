import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetMapper } from 'src/module/asset/asset.mapper';
import {
  ComparisonOperators,
  FilterParam,
  LogicalOperators,
} from 'src/shared/mongo/interfaces';
import MongoUtils from 'src/shared/mongo/utils';
import { Asset } from '../../../domain/asset';
import { AssetRepo, IAssetFind, IAssetFindOptions } from '../../asset.repo';
import { AssetDocument } from './schemas/asset.schema';
@Injectable()
export class MongoAssetRepo implements AssetRepo {
  private readonly logger = new Logger(MongoAssetRepo.name);

  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async bulkUpsertAsset(assets: Asset[]): Promise<void> {
    this.logger.log(`bulkUpsertAsset asset ${assets.length}`);
    const entryIndex = [];
    const ops = assets.map(
      ({
        id,
        address,
        tokenId,
        imageUrl,
        imagePreviewUrl,
        imageThumbnailUrl,
        imageOriginalUrl,
        name,
        description,
        externalLink,
        permalink,
        owner,
        price,
        sellOrders,
        buyOrders,
        auctions,
        supportsWyvern,
        traits,
        updatedAt,
      }) => {
        entryIndex.push({ tokenId });
        return {
          updateOne: {
            filter: { tokenId, address },
            update: {
              $set: {
                id,
                imageUrl,
                imagePreviewUrl,
                imageThumbnailUrl,
                imageOriginalUrl,
                name,
                description,
                externalLink,
                permalink,
                owner,
                price,
                sellOrders,
                buyOrders,
                auctions,
                supportsWyvern,
                traits,
                updatedAt,
              },
            },
            upsert: true,
          },
        };
      },
    );

    await this.assetModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertAsset successful`);
  }

  async find(
    address: string,
    { tokenIds, traits }: IAssetFind,
    options: IAssetFindOptions,
  ) {
    this.logger.log(`find assets`);

    const query = this.queryBuilder({
      address,
      tokenIds,
      hasPrice: !!options.floor,
      traits,
    });
    let ops = this.assetModel.find(query);

    if (options.floor) {
      ops = ops.sort({ price: 1 }).limit(1);
    }
    this.logger.log(`find assets query ${JSON.stringify(query)}`);
    const assets = await ops;
    return Promise.all(
      assets.map((asset) => AssetMapper.toDomain(asset.toObject())),
    );
  }

  queryBuilder({
    address,
    tokenIds,
    hasPrice,
    traits,
  }: IAssetFind & { address: string; hasPrice: boolean }) {
    const query: any = { address };
    if (tokenIds) {
      query.tokenId = { $in: tokenIds };
    }
    if (hasPrice) {
      query.price = { $ne: null };
    }
    if (traits && traits.length) {
      query['$and'] = traits.map((trait) => {
        const { traitType, value, operator } = trait;
        return {
          traits: {
            $elemMatch: {
              traitType,
              value: MongoUtils.comparativeQueryBuilder(value, operator),
            },
          },
        };
      });
    }
    return query;
  }

  traitQueryBuilder(filters: FilterParam[], operator: LogicalOperators) {
    return {
      [`$${operator}`]: filters.map((filter) => {
        const { traitType, value } = filter;
        return {
          traits: {
            $elemMatch: {
              ...(traitType && {
                traitType: MongoUtils.comparativeQueryBuilder(
                  traitType.value,
                  traitType.operator as ComparisonOperators,
                ),
              }),
              ...(value && {
                value: MongoUtils.comparativeQueryBuilder(
                  value.value,
                  value.operator as ComparisonOperators,
                ),
              }),
            },
          },
        };
      }),
    };
  }
}
