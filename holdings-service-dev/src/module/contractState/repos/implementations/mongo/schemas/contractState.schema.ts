import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type ContractStateDocument = ContractState & Document;

@Schema()
export class ContractState {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  address: string;

  @Prop({
    type: Number,
    required: true,
  })
  floorPrice: number;

  @Prop({
    type: Number,
    required: true,
  })
  oneDayVolume: number;

  @Prop({
    type: Number,
    required: true,
  })
  sevenDayVolume: number;

  @Prop({
    type: Number,
    required: true,
  })
  thirtyDayVolume: number;

  @Prop({
    type: Number,
    required: true,
  })
  totalVolume: number;

  @Prop({
    type: Number,
    required: true,
  })
  oneDayAveragePrice: number;

  @Prop({
    type: Number,
    required: true,
  })
  sevenDayAveragePrice: number;

  @Prop({
    type: Number,
    required: true,
  })
  thirtyDayAveragePrice: number;

  @Prop({
    type: Number,
    required: true,
  })
  averagePrice: number;

  @Prop({
    type: Number,
    required: true,
  })
  oneDaySales: number;

  @Prop({
    type: Number,
    required: true,
  })
  sevenDaySales: number;

  @Prop({
    type: Number,
    required: true,
  })
  thirtyDaySales: number;

  @Prop({
    type: Number,
    required: true,
  })
  totalSales: number;

  @Prop({
    type: Number,
    required: true,
  })
  numOwners: number;

  @Prop({
    type: Number,
    required: true,
  })
  marketCap: number;

  @Prop({
    type: Date,
    required: true,
  })
  timeAt: Date;
}

export const ContractStateSchema = SchemaFactory.createForClass(ContractState);
