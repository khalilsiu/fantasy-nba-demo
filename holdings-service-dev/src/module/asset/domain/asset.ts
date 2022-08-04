import { Logger } from '@nestjs/common';
import {
  Allow,
  IsArray,
  IsBoolean,
  IsDate,
  IsEthereumAddress,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  validate,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

export interface Trait {
  traitType: string;
  value: string;
  traitCount: number;
}

export interface User {
  user: {
    username?: string;
  };
  profileImgUrl?: string;
  address: string;
}

export class PaymentToken {
  @Allow()
  symbol: string;
  @Allow()
  address: string;
  @Allow()
  ethPrice: string;
  @Allow()
  usdPrice: string;
  @Allow()
  decimals: number;
}

export interface Auction {
  auctionContractAddress: string;
  currentPrice: string;
  startedAt: string;
  duration: string;
  startingPrice: string;
  endingPrice: string;
  paymentToken: PaymentToken;
}

export interface Order {
  createdDate: Date;
  closingDate: Date;
  currentPrice: string;
  orderHash: string;
  exchange: string;
  maker: User;
  taker: User;
  side: number;
  paymentToken: PaymentToken;
}
export interface AssetProps {
  id: number;
  address: string;
  tokenId: string;
  imageUrl: string;
  imagePreviewUrl?: string;
  imageThumbnailUrl?: string;
  imageOriginalUrl?: string;
  name?: string;
  description?: string;
  externalLink?: string;
  permalink?: string;
  owner: User;
  price?: number;
  sellOrders: Order[];
  buyOrders: Order[];
  auctions: Auction[];
  supportsWyvern?: boolean;
  traits: Trait[];
  updatedAt: Date;
}

export class Asset {
  @IsNumber()
  readonly id: number;

  @IsEthereumAddress()
  @Length(2, 255)
  readonly address: string;

  @IsString()
  readonly tokenId: string;

  @IsString()
  @IsUrl()
  readonly imageUrl: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly imagePreviewUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly imageThumbnailUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly imageOriginalUrl?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly externalLink?: string;

  @IsString()
  @IsOptional()
  readonly permalink?: string;

  @IsObject()
  readonly owner: User;

  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsArray()
  readonly sellOrders: Order[];

  @IsArray()
  readonly buyOrders: Order[];

  @IsArray()
  readonly auctions: Auction[];

  @IsBoolean()
  @IsOptional()
  readonly supportsWyvern?: boolean;

  @IsArray()
  readonly traits: Trait[];

  @IsDate()
  readonly updatedAt?: Date;

  static readonly logger = new Logger(Asset.name);
  constructor({
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
  }: AssetProps) {
    this.id = id;
    this.address = address;
    this.tokenId = tokenId;
    this.imageUrl = imageUrl;
    this.imagePreviewUrl = imagePreviewUrl;
    this.imageThumbnailUrl = imageThumbnailUrl;
    this.imageOriginalUrl = imageOriginalUrl;
    this.name = name;
    this.description = description;
    this.externalLink = externalLink;
    this.permalink = permalink;
    this.owner = owner;
    this.price = price;
    this.sellOrders = sellOrders;
    this.buyOrders = buyOrders;
    this.auctions = auctions;
    this.supportsWyvern = supportsWyvern;
    this.traits = traits;
    this.updatedAt = updatedAt;
  }

  public static async create(props: AssetProps): Promise<Result<Asset>> {
    this.logger.log(`create AssetProps ${JSON.stringify(props)}`);

    const asset = new Asset(props);
    this.logger.log(`created Asset`);

    const errors = await validate(asset);

    if (errors.length > 0) {
      return Result.fail<Asset>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Asset>(asset);
  }
}
