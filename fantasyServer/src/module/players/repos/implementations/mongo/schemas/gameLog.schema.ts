import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type GameLogDocument = GameLog & Document;

@Schema()
export class GameLog {
  @Prop({
    type: Number,
    required: true,
  })
  playerId: number;

  @Prop({
    type: Number,
    required: true,
  })
  teamId: number;

  @Prop({
    type: Number,
    required: true,
  })
  gameId: number;

  @Prop({
    type: Number,
  })
  points?: number;

  @Prop({
    type: String,
  })
  pos?: string;

  @Prop({
    type: String,
  })
  min?: string;

  @Prop({
    type: Number,
  })
  fgm?: number;

  @Prop({
    type: Number,
  })
  fga?: number;

  @Prop({
    type: String,
  })
  fgp?: string;

  @Prop({
    type: Number,
  })
  ftm?: number;

  @Prop({
    type: Number,
  })
  fta?: number;

  @Prop({
    type: String,
  })
  ftp?: string;

  @Prop({
    type: Number,
  })
  tpm?: number;

  @Prop({
    type: Number,
  })
  tpa?: number;

  @Prop({
    type: String,
  })
  tpp?: string;

  @Prop({
    type: Number,
  })
  offReb?: number;

  @Prop({
    type: Number,
  })
  defReb?: number;

  @Prop({
    type: Number,
  })
  totReb?: number;

  @Prop({
    type: Number,
  })
  assists?: number;

  @Prop({
    type: Number,
  })
  pFouls?: number;

  @Prop({
    type: Number,
  })
  steals?: number;

  @Prop({
    type: Number,
  })
  turnovers?: number;

  @Prop({
    type: Number,
  })
  blocks?: number;

  @Prop({
    type: String,
  })
  plusMinus: string;

  @Prop({
    type: String,
  })
  comment: string;
}

export const GameLogSchema = SchemaFactory.createForClass(GameLog);
GameLogSchema.index({ gameId: 1, playerId: 1 }, { unique: true });
GameLogSchema.index({ playerId: 1 });
