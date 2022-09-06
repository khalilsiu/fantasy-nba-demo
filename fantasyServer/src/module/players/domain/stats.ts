import { Logger } from '@nestjs/common';
import {
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  validate,
  ValidateNested,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';
import { Type } from 'class-transformer';

export class AggregatedStats {
  @IsNumber()
  @IsOptional()
  readonly points?: number;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly pos?: string;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly min?: string;

  @IsNumber()
  @IsOptional()
  readonly fgm?: number;

  @IsNumber()
  @IsOptional()
  readonly fga?: number;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly fgp?: string;

  @IsNumber()
  @IsOptional()
  readonly ftm?: number;

  @IsNumber()
  @IsOptional()
  readonly fta?: number;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly ftp?: string;

  @IsNumber()
  @IsOptional()
  readonly tpm?: number;

  @IsNumber()
  @IsOptional()
  readonly tpa?: number;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly tpp?: string;

  @IsNumber()
  @IsOptional()
  readonly offReb?: number;

  @IsNumber()
  @IsOptional()
  readonly defReb?: number;

  @IsNumber()
  @IsOptional()
  readonly totReb?: number;

  @IsNumber()
  @IsOptional()
  readonly assists?: number;

  @IsNumber()
  @IsOptional()
  readonly pFouls?: number;

  @IsNumber()
  @IsOptional()
  readonly steals?: number;

  @IsNumber()
  @IsOptional()
  readonly turnovers?: number;
  @IsOptional()
  readonly blocks?: number;
}

export interface StatsProps {
  playerId: number;
  last7DaysAvg: AggregatedStats;
  last7DaysTot: AggregatedStats;
  last14DaysAvg: AggregatedStats;
  last14DaysTot: AggregatedStats;
  last30DaysAvg: AggregatedStats;
  last30DaysTot: AggregatedStats;
  seasonAvg: AggregatedStats;
  seasonTot: AggregatedStats;
  lastSeasonAvg: AggregatedStats;
  lastSeasonTot: AggregatedStats;
}

export class Stats {
  @IsNumber()
  playerId: number;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  last7DaysAvg: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  last7DaysTot: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  last14DaysAvg: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  last14DaysTot: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  last30DaysAvg: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  last30DaysTot: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  seasonAvg: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  seasonTot: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  lastSeasonAvg: AggregatedStats;

  @ValidateNested()
  @Type(() => AggregatedStats)
  @IsObject()
  @IsNotEmptyObject()
  lastSeasonTot: AggregatedStats;

  static readonly logger = new Logger(Stats.name);
  constructor({
    playerId,
    last7DaysAvg,
    last7DaysTot,
    last14DaysAvg,
    last14DaysTot,
    last30DaysAvg,
    last30DaysTot,
    seasonAvg,
    seasonTot,
    lastSeasonAvg,
    lastSeasonTot,
  }: StatsProps) {
    this.playerId = playerId;
    this.last7DaysAvg = last7DaysAvg;
    this.last7DaysTot = last7DaysTot;
    this.last14DaysAvg = last14DaysAvg;
    this.last14DaysTot = last14DaysTot;
    this.last30DaysAvg = last30DaysAvg;
    this.last30DaysTot = last30DaysTot;
    this.seasonAvg = seasonAvg;
    this.seasonTot = seasonTot;
    this.lastSeasonAvg = lastSeasonAvg;
    this.lastSeasonTot = lastSeasonTot;
  }

  public static async create(props: StatsProps): Promise<Result<Stats>> {
    this.logger.log(`create stats`);

    const stats = new Stats(props);
    const errors = await validate(stats);
    this.logger.log(`validated create stats`);

    if (errors.length > 0) {
      return Result.fail<Stats>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Stats>(stats);
  }
}
