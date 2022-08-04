import { ComparisonOperators } from 'src/shared/mongo/interfaces';
import { Asset } from '../domain/asset';

export const ASSET_REPO = 'ASSET REPO';
export interface IAssetFind {
  tokenIds?: string[];
  traits?: { traitType: string; value: any; operator: ComparisonOperators }[];
}

export interface IAssetFindOptions {
  floor: boolean;
}

export interface AssetRepo {
  bulkUpsertAsset(assets: Asset[]): Promise<void>;
  find(
    address: string,
    filter: IAssetFind,
    options: IAssetFindOptions,
  ): Promise<Asset[]>;
}
