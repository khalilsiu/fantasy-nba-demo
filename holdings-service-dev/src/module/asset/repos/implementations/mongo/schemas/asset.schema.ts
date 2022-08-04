import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Auction, Order, Trait, User } from 'src/module/asset/domain/asset';
export type AssetDocument = Asset & Document;

@Schema()
export class Asset {
  @Prop({
    type: Number,
    required: true,
  })
  id: number;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  tokenId: string;

  @Prop({
    type: String,
    required: true,
  })
  imageUrl: string;

  @Prop({
    type: String,
  })
  imagePreviewUrl?: string;

  @Prop({
    type: String,
  })
  imageThumbnailUrl?: string;

  @Prop({
    type: String,
  })
  imageOriginalUrl?: string;

  @Prop({
    type: String,
  })
  name?: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: String,
  })
  externalLink?: string;

  @Prop({
    type: String,
    required: true,
  })
  permalink: string;

  @Prop({
    type: Object,
    required: true,
  })
  owner: User;

  @Prop({
    type: Number,
  })
  price?: number;

  @Prop({
    type: Object,
    default: [],
    required: true,
  })
  sellOrders: Order[];

  @Prop({
    type: Object,
    default: [],
    required: true,
  })
  buyOrders: Order[];

  @Prop({
    type: Object,
    default: [],
    required: true,
  })
  auctions: Auction[];

  @Prop({
    type: Array,
    required: true,
  })
  traits: Trait[];

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  supportsWyvern: boolean;

  @Prop({
    type: Date,
    required: true,
  })
  updatedAt: Date;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
AssetSchema.index({ address: 1, tokenId: 1 }, { unique: true });
AssetSchema.index({ address: 1, updatedAt: 1 });
AssetSchema.index({ address: 1, 'traits.traitType': 1, 'traits.value': 1 });
