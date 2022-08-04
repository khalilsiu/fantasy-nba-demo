import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentToken, User } from 'src/module/asset/domain/asset';
export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
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
    type: Object,
    required: true,
  })
  paymentToken: PaymentToken;

  @Prop({
    type: Object,
  })
  fromAccount: User;

  @Prop({
    type: Object,
  })
  toAccount: User;

  @Prop({
    type: String,
    required: true,
  })
  totalPrice: string;

  @Prop({
    type: Number,
    required: true,
  })
  priceInEth: number;

  @Prop({
    type: String,
    required: true,
  })
  transactionHash: string;

  @Prop({
    type: Date,
    required: true,
  })
  timestamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index(
  { address: 1, tokenId: 1, timestamp: 1 },
  { unique: true },
);
