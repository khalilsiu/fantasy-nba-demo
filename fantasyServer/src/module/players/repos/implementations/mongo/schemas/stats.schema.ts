import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AggregatedStats } from 'src/module/players/domain/stats';
export type StatsDocument = Stats & Document;

@Schema()
export class Stats {
  @Prop({
    type: Number,
    required: true,
  })
  playerId: number;

  @Prop({
    type: Object,
    required: true,
  })
  last7DaysAvg: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  last7DaysTot: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  last14DaysAvg: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  last14DaysTot: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  last30DaysAvg: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  last30DaysTot: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  thisSeasonAvg: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  thisSeasonTot: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  lastSeasonAvg: AggregatedStats;

  @Prop({
    type: Object,
    required: true,
  })
  lastSeasonTot: AggregatedStats;
}

export const StatsSchema = SchemaFactory.createForClass(Stats);
StatsSchema.index({ playerId: 1 }, { unique: true });
