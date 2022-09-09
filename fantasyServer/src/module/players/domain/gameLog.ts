import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  validate,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

export interface GameLogProps {
  playerId: number;
  teamId: number;
  gameId: number;
  points?: number;
  pos?: string;
  min?: string;
  fgm?: number;
  fga?: number;
  fgp?: string;
  ftm?: number;
  fta?: number;
  ftp?: string;
  tpm?: number;
  tpa?: number;
  tpp?: string;
  offReb?: number;
  defReb?: number;
  totReb?: number;
  assists?: number;
  pFouls?: number;
  steals?: number;
  turnovers?: number;
  blocks?: number;
  plusMinus?: string;
  comment?: string;
}

export class GameLog {
  @IsNumber()
  @Type(() => Number)
  readonly playerId: number;

  @IsNumber()
  readonly teamId: number;

  @IsNumber()
  readonly gameId: number;

  @IsNumber()
  @IsOptional()
  readonly points?: number;

  @IsString()
  @IsOptional()
  readonly pos?: string;

  @IsString()
  @IsOptional()
  readonly min?: string;

  @IsNumber()
  @IsOptional()
  readonly fgm?: number;

  @IsNumber()
  @IsOptional()
  readonly fga?: number;

  @IsString()
  @IsOptional()
  readonly fgp?: string;

  @IsNumber()
  @IsOptional()
  readonly ftm?: number;

  @IsNumber()
  @IsOptional()
  readonly fta?: number;

  @IsString()
  @IsOptional()
  readonly ftp?: string;

  @IsNumber()
  @IsOptional()
  readonly tpm?: number;

  @IsNumber()
  @IsOptional()
  readonly tpa?: number;

  @IsString()
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

  @IsString()
  @IsOptional()
  readonly plusMinus?: string;

  @IsString()
  @IsOptional()
  readonly comment?: string;

  static readonly logger = new Logger(GameLog.name);
  constructor({
    playerId,
    teamId,
    gameId,
    points,
    pos,
    min,
    fgm,
    fga,
    fgp,
    ftm,
    fta,
    ftp,
    tpm,
    tpa,
    tpp,
    offReb,
    defReb,
    totReb,
    assists,
    pFouls,
    steals,
    turnovers,
    blocks,
    plusMinus,
    comment,
  }: GameLogProps) {
    this.playerId = playerId;
    this.teamId = teamId;
    this.gameId = gameId;
    this.points = points;
    this.pos = pos;
    this.min = min;
    this.fgm = fgm;
    this.fga = fga;
    this.fgp = fgp;
    this.ftm = ftm;
    this.fta = fta;
    this.ftp = ftp;
    this.tpm = tpm;
    this.tpa = tpa;
    this.tpp = tpp;
    this.offReb = offReb;
    this.defReb = defReb;
    this.totReb = totReb;
    this.assists = assists;
    this.pFouls = pFouls;
    this.steals = steals;
    this.turnovers = turnovers;
    this.blocks = blocks;
    this.plusMinus = plusMinus;
    this.comment = comment;
  }

  public static async create(props: GameLogProps): Promise<Result<GameLog>> {
    this.logger.log(`create gameLog props ${JSON.stringify(props)}`);

    const gameLog = new GameLog(props);
    const errors = await validate(gameLog);
    this.logger.log(`validated create gameLog`);

    if (errors.length > 0) {
      return Result.fail<GameLog>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<GameLog>(gameLog);
  }
}
