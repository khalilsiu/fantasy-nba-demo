import { Logger } from '@nestjs/common';
import {
  IsNumber,
  validate,
  ValidateNested,
  IsString,
  IsArray,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';
import { Type } from 'class-transformer';

export interface TeamProps {
  _id?: string;
  leagueId: string;
  walletAddress: string;
  name: string;
  roster?: number[];
  wins?: number;
  losses?: number;
  ties?: number;
  moves?: number;
  waiverRank?: number;
  createdAt: Date;
  deletedAt?: Date;
}

export class Team {
  @IsString()
  @IsOptional()
  readonly _id?: string;

  @IsString()
  readonly leagueId: string;

  @IsString()
  readonly walletAddress: string;

  @IsString()
  readonly name: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Number)
  readonly roster: number[];

  @IsNumber()
  readonly wins: number;

  @IsNumber()
  readonly losses: number;

  @IsNumber()
  readonly ties: number;

  @IsNumber()
  readonly moves: number;

  @IsNumber()
  readonly waiverRank: number;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly deletedAt?: Date;

  static readonly logger = new Logger(Team.name);
  constructor({
    _id,
    leagueId,
    walletAddress,
    name = 'Your Dream Team',
    roster = [],
    wins = 0,
    losses = 0,
    ties = 0,
    moves = 0,
    waiverRank,
    createdAt,
    deletedAt,
  }: TeamProps) {
    this._id = _id;
    this.leagueId = leagueId;
    this.walletAddress = walletAddress;
    this.name = name;
    this.roster = roster;
    this.wins = wins;
    this.losses = losses;
    this.ties = ties;
    this.moves = moves;
    this.waiverRank = waiverRank;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  public static async create(props: TeamProps): Promise<Result<Team>> {
    this.logger.log(`create team`);
    let createdAt = props.createdAt;

    if (!props.createdAt) {
      createdAt = new Date();
    }

    const team = new Team({ ...props, createdAt });
    const errors = await validate(team);

    this.logger.log(`validated create team`);

    if (errors.length > 0) {
      return Result.fail<Team>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Team>(team);
  }
}
