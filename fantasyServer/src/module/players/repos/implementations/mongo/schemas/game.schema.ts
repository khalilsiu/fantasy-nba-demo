import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  GameArena,
  GameDate,
  GamePeriods,
  GameScores,
  GameStatus,
  GameTeams,
} from 'src/module/players/domain/game';
export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({
    type: Number,
    required: true,
  })
  gameId: number;

  @Prop({
    type: Number,
    required: true,
  })
  season: number;

  @Prop({
    type: Object,
    required: true,
  })
  date: GameDate;

  @Prop({
    type: Object,
    required: true,
  })
  status: GameStatus;

  @Prop({
    type: Object,
    required: true,
  })
  periods: GamePeriods;

  @Prop({
    type: Object,
    required: true,
  })
  arena: GameArena;

  @Prop({
    type: Object,
    required: true,
  })
  teams: GameTeams;

  @Prop({
    type: Object,
    required: true,
  })
  scores: GameScores;
}

export const GameSchema = SchemaFactory.createForClass(Game);
GameSchema.index({ gameId: 1 }, { unique: true });
GameSchema.index({ season: 1 });
