import { Logger } from '@nestjs/common';
import { Asset, PaymentToken } from './domain/asset';
import { snakeize } from 'src/shared/utils';
interface FloorPriceItem {
  price: string;
  paymentToken: PaymentToken;
}
export class AssetMapper {
  static readonly logger = new Logger(AssetMapper.name);

  static async toDomain({
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
  }: any): Promise<Asset> {
    const assetOrError = await Asset.create({
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
    });
    this.logger.log(`toDomain assetOrError ${JSON.stringify(assetOrError)}`);

    if (assetOrError.isFailure) {
      throw new Error('AssetMapper map to domain failed.');
    }
    return assetOrError.getValue();
  }

  static toFloorPriceDTO(asset: Asset) {
    const { sellOrders, auctions, updatedAt, tokenId } = asset;

    const floorPriceItems: FloorPriceItem[] = [
      ...sellOrders.map((order) => ({
        price: order.currentPrice,
        paymentToken: order.paymentToken,
      })),
      ...auctions.map((order) => ({
        price: order.currentPrice,
        paymentToken: order.paymentToken,
      })),
    ];

    let floorPrice = Number.MAX_VALUE;
    const floorPriceItem = floorPriceItems.reduce((acc, item) => {
      const ethFloor =
        (parseFloat(item.price) / 10 ** item.paymentToken.decimals) *
        parseFloat(item.paymentToken.ethPrice);
      if (ethFloor < floorPrice) {
        floorPrice = ethFloor;
        acc = item;
      }
      return acc;
    }, {} as FloorPriceItem);

    return snakeize({
      ...floorPriceItem,
      tokenId,
      updatedAt,
    });
  }

  static toDTO(asset: Asset) {
    const {
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
    } = asset;

    return snakeize({
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
    });
  }
}
