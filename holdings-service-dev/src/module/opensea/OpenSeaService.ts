import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';

export const OPENSEA_SERVICE = 'OPENSEA SERVICE';
const uri = 'https://api.opensea.io/api/v1';

@Injectable()
export class OpenSeaService {
  private static logger = new Logger(OpenSeaService.name);
  public static async fetchSingleAsset(
    tokenAddress: string,
    tokenId: string,
  ): Promise<any> {
    this.logger.log(
      `OpenSeaService fetchSingleAsset, address: ${tokenAddress}, tokenId: ${tokenId}`,
    );
    const fetchAssetUri = `${uri}/asset/${tokenAddress}/${tokenId}`;
    this.logger.log(`OpenSeaService fetchSingleAsset ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri);
    const asset = await res.json();
    this.logger.log(`OpenSeaService fetchSingleAsset ${JSON.stringify(asset)}`);
    return asset;
  }

  public static async fetchSingleContract(tokenAddress: string): Promise<any> {
    this.logger.log(
      `OpenSeaService fetchSingleContract, address: ${tokenAddress}`,
    );
    const fetchUri = `${uri}/asset_contract/${tokenAddress}`;
    this.logger.log(`OpenSeaService fetchSingleContract ${fetchUri}`);
    const res = await fetch(fetchUri);
    const assetContract = await res.json();
    this.logger.log(
      `OpenSeaService fetchSingleContract ${JSON.stringify(assetContract)}`,
    );
    return assetContract;
  }

  public static async fetchContractStats(tokenAddress: string): Promise<any> {
    this.logger.log(
      `OpenSeaService fetchContractStats, address: ${tokenAddress}`,
    );
    const { collection } = await this.fetchSingleContract(tokenAddress);
    if (!collection || !collection.slug) {
      throw new Error('fetchContractStats no collection or slug available');
    }

    const fetchUri = `${uri}/collection/${collection.slug}/stats`;
    this.logger.log(`OpenSeaService fetchContractStats ${fetchUri}`);
    const res = await fetch(fetchUri);
    const contractStats = await res.json();
    this.logger.log(
      `OpenSeaService fetchContractStats ${JSON.stringify(contractStats)}`,
    );
    return contractStats;
  }

  public static async fetchAsset(
    address: string,
    tokenId: string,
  ): Promise<any> {
    this.logger.log(
      `OpenSeaService fetchAsset, address: ${address}, tokenId: ${tokenId}`,
    );
    if (!address) {
      throw new Error('address is missing');
    }
    if (!tokenId) {
      throw new Error('tokenId is missing');
    }
    const fetchUri = `${uri}/asset/${address}/${tokenId}`;
    this.logger.log(`OpenSeaService fetchAsset ${fetchUri}`);
    const res = await fetch(fetchUri, {
      headers: {
        'X-API-KEY': process.env.OPEN_SEA_API_KEY,
      },
    });
    if (res.status >= 300) {
      throw new Error(
        `OpenSeaService fetchAsset error: ${res.status} address: ${address}, tokenId: ${tokenId}`,
      );
    }
    const asset = await res.json();

    this.logger.log(
      `OpenSeaService fetchBatchAssets ${fetchUri}, asset ${JSON.stringify(
        asset,
      )}`,
    );
    return asset;
  }

  public static async fetchBatchAssets(
    address: string,
    tokenIds: string[],
  ): Promise<any> {
    this.logger.log(`OpenSeaService fetchBatchAssets, address: ${address}`);
    if (tokenIds.length > 30) {
      throw new Error('At most 30 token ids');
    }
    const queryString = tokenIds
      .map((tokenId) => `token_ids=${tokenId}`)
      .join('&');

    const fetchUri = `${uri}/assets?asset_contract_address=${address}&order_direction=desc&${queryString}`;

    this.logger.log(`OpenSeaService fetchBatchAssets ${fetchUri}`);

    const res = await fetch(fetchUri);

    const response = await res.json();
    this.logger.log(
      `OpenSeaService fetchBatchAssets response ${JSON.stringify(response)}`,
    );

    const { assets } = response;
    if (!assets) {
      throw new Error('No assets returned');
    }

    this.logger.log(
      `OpenSeaService fetchBatchAssets ${fetchUri}, assets ${JSON.stringify(
        assets,
      )}`,
    );
    return assets;
  }
}
