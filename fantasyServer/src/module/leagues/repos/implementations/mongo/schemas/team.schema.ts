import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  leagueId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  walletAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Array,
    required: true,
  })
  roster: number[];

  @Prop({
    type: Number,
    required: true,
  })
  wins: number;

  @Prop({
    type: Number,
    required: true,
  })
  losses: number;

  @Prop({
    type: Number,
    required: true,
  })
  ties: number;

  @Prop({
    type: Number,
    required: true,
  })
  moves: number;

  @Prop({
    type: Number,
    required: true,
  })
  waiverRank: number;

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

export const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.index({ leagueId: 1, walletAddress: 1 }, { unique: true });
