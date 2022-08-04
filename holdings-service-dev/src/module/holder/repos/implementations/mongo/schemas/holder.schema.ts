import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type HolderDocument = Holder & Document;

@Schema()
export class Holder {
  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  contractAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  tokenId: string;
}

export const HolderSchema = SchemaFactory.createForClass(Holder);
HolderSchema.index({ contractAddress: 1, tokenId: 1 }, { unique: true });
