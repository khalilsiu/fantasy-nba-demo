import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  validate,
  ValidateNested,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

class Team {
  id: number;
  name: string;
  nickname: string;
  code: string;
  logo: string;
}

export interface PlayerStatsProps {
  playerId: number;
  team: Team;
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

export class PlayerStats {
  @IsNumber()
  readonly playerId: number;

  @ValidateNested({ each: true })
  @Type(() => Team)
  readonly team: Team;

  @IsNumber()
  readonly gameId: number;

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

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly plusMinus?: string;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  readonly comment?: string;

  static readonly logger = new Logger(PlayerStats.name);
  constructor({
    playerId,
    team,
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
  }: PlayerStatsProps) {
    this.playerId = playerId;
    this.team = team;
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

  public static async create(
    props: PlayerStatsProps,
  ): Promise<Result<PlayerStats>> {
    this.logger.log(`create PlayerStatsProps ${JSON.stringify(props)}`);

    const player = new PlayerStats(props);
    this.logger.log(`created PlayerStats`);

    const errors = await validate(PlayerStats);

    if (errors.length > 0) {
      return Result.fail<PlayerStats>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<PlayerStats>(player);
  }
}
