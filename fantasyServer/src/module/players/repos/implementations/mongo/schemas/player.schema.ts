import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Birth, Height, Nba, Weight } from 'src/module/players/domain/player';
export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({
    type: Number,
    required: true,
  })
  playerId: number;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: Object,
    required: true,
  })
  birth: Birth;

  @Prop({
    type: Object,
    required: true,
  })
  nba: Nba;

  @Prop({
    type: Object,
    required: true,
  })
  height: Height;

  @Prop({
    type: Object,
    required: true,
  })
  weight: Weight;

  @Prop({
    type: String,
    required: true,
  })
  college: string;

  @Prop({
    type: String,
    required: true,
  })
  affiliation: string;

  @Prop({
    type: Number,
  })
  jersey: number;

  @Prop({
    type: Boolean,
  })
  active: boolean;

  @Prop({
    type: String,
  })
  pos: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
PlayerSchema.index({ playerId: 1 }, { unique: true });
PlayerSchema.index({ pos: 1 });
