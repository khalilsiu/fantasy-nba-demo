import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AcceptedTokens } from 'src/module/lease/constants/AcceptedToken';
import { LeaseStatus } from 'src/module/lease/domain/lease';
export type LeaseDocument = Lease & Document;

@Schema()
export class Lease {
  @Prop({
    type: Number,
    required: true,
  })
  rentAmount: number;

  @Prop({
    type: Number,
    required: true,
  })
  deposit: number;

  @Prop({
    type: Number,
    required: true,
  })
  monthsPaid: number;

  @Prop({
    type: Number,
    required: true,
    min: 7,
  })
  gracePeriod: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  minLeaseLength: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  maxLeaseLength: number;

  @Prop({
    type: String,
    enum: Object.values(AcceptedTokens).filter((x) => typeof x !== 'number'),
    required: true,
  })
  rentToken: AcceptedTokens;

  @Prop({
    type: String,
    enum: Object.values(LeaseStatus).filter((x) => typeof x !== 'number'),
    required: true,
  })
  status: LeaseStatus;

  @Prop({
    type: Boolean,
    required: true,
  })
  autoRegenerate: boolean;

  @Prop({
    type: String,
    required: true,
  })
  lessor: string;

  @Prop({
    type: String,
    required: true,
  })
  lessee: string;

  @Prop({
    type: String,
    required: true,
  })
  tokenId: string;

  @Prop({
    type: String,
    required: true,
  })
  contractAddress: string;

  @Prop({
    type: Date,
    required: true,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    required: true,
  })
  updatedAt: Date;

  @Prop({
    type: Number,
  })
  finalLeaseLength: number;

  @Prop({
    type: Date,
  })
  dateSigned: Date;
}
export const LeaseSchema = SchemaFactory.createForClass(Lease);

LeaseSchema.index({ contractAddress: 1, tokenId: 1 });
LeaseSchema.index({ lessor: 1 });
LeaseSchema.index({ lessee: 1 });
LeaseSchema.index({ lessor: 1, contractAddress: 1, tokenId: 1 });
LeaseSchema.index({ lessee: 1, contractAddress: 1, tokenId: 1 });
