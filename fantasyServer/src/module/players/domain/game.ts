import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  validate,
  ValidateNested,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

export class GameDate {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsString()
  duration: string;
}

export class GameStatus {
  @IsString()
  @IsOptional()
  clock?: string;

  @IsBoolean()
  halftime: boolean;

  @IsNumber()
  short: number;

  @IsString()
  long: string;
}

export class GamePeriods {
  @IsNumber()
  current: number;

  @IsNumber()
  total: number;

  @IsBoolean()
  endOfPeriod: boolean;
}

export class GameArena {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  state: string;
}

export class GameTeam {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  code: string;
}

export class GameTeams {
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameTeam)
  visitors: GameTeam;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameTeam)
  home: GameTeam;
}

export class GameSeries {
  @IsNumber()
  win: number;

  @IsNumber()
  loss: number;
}

export class GameScore {
  @IsNumber()
  win: number;

  @IsNumber()
  loss: number;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameSeries)
  series: GameSeries;

  @ValidateNested({ each: true })
  @Type(() => String)
  linescore: string[];

  @IsNumber()
  points: number;
}

export class GameScores {
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameScore)
  visitors: GameScore;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameScore)
  home: GameScore;
}

export interface GameProps {
  gameId: number;
  season: number;
  date: GameDate;
  status: GameStatus;
  periods: GamePeriods;
  arena: GameArena;
  teams: GameTeams;
  scores: GameScores;
}

export class Game {
  @IsNumber()
  readonly gameId: number;

  @IsNumber()
  readonly season: number;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameDate)
  readonly date: GameDate;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameStatus)
  readonly status: GameStatus;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GamePeriods)
  readonly periods: GamePeriods;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameArena)
  readonly arena: GameArena;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameTeams)
  readonly teams: GameTeams;

  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => GameScores)
  readonly scores: GameScores;

  static readonly logger = new Logger(Game.name);
  constructor({
    gameId,
    season,
    date,
    status,
    periods,
    arena,
    teams,
    scores,
  }: GameProps) {
    this.gameId = gameId;
    this.season = season;
    this.date = date;
    this.status = status;
    this.periods = periods;
    this.arena = arena;
    this.teams = teams;
    this.scores = scores;
  }

  public static async create(props: GameProps): Promise<Result<Game>> {
    this.logger.log(`create game`);

    const game = new Game(props);
    const errors = await validate(game);
    this.logger.log(`validated create game`);

    if (errors.length > 0) {
      return Result.fail<Game>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Game>(game);
  }
}
