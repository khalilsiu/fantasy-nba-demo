import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FeatureKeys } from 'src/module/contract/constant/FeatureKeys';
export type ContractDocument = Contract & Document;
export type BotConfigDocument = BotConfig & Document;

@Schema({ _id: false })
class BotConfig {
  @Prop({
    required: true,
    type: String,
    enum: Object.values(FeatureKeys).filter((x) => typeof x !== 'number'),
  })
  type: string;

  @Prop({
    type: String,
    required: true,
  })
  token: string;
}

export const BotConfigSchema = SchemaFactory.createForClass(BotConfig);
@Schema()
export class Contract {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  address: string;

  @Prop({
    type: Number,
    required: true,
  })
  blockNumber: number;

  @Prop({
    type: String,
    enum: ['UPDATING', 'READY'],
    required: true,
  })
  status: string;

  @Prop({
    type: [String],
  })
  signatures: string[];

  @Prop({
    type: [String],
    enum: Object.values(FeatureKeys).filter((x) => typeof x !== 'number'),
  })
  featureKeys: string[];

  @Prop({
    type: [BotConfigSchema],
  })
  botConfig: BotConfig[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
