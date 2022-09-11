import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type LeagueDocument = League & Document;

@Schema()
export class League {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Array,
    required: true,
  })
  teamIds: number[];

  @Prop({
    type: Date,
    required: true,
  })
  draftDateTime: Date;

  @Prop({
    type: Number,
    required: true,
  })
  maxTeams: number;

  @Prop({
    type: String,
    required: true,
  })
  commissionerWalletId: string;

  @Prop({
    type: Number,
    required: true,
  })
  commissionerFee: number;

  @Prop({
    type: Number,
    required: true,
  })
  entryFee: number;

  @Prop({
    type: Date,
    required: true,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  deletedAt: Date;
}

export const LeagueSchema = SchemaFactory.createForClass(League);
