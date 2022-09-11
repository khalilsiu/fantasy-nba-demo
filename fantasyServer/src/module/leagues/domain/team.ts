import { Logger } from '@nestjs/common';
import {
  IsNumber,
  validate,
  ValidateNested,
  IsString,
  IsArray,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';
import { Type } from 'class-transformer';

export interface TeamProps {
  _id: string;
  leagueId: number;
  walletId: string;
  name: string;
  roster: number[];
  wins: number;
  losses: number;
  ties: number;
  moves: number;
  waiverRank: number;
}

export class Team {
  @IsString()
  readonly _id: string;

  @IsNumber()
  readonly leagueId: number;

  @IsString()
  readonly walletId: string;

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

  static readonly logger = new Logger(Team.name);
  constructor({
    _id,
    leagueId,
    walletId,
    name,
    roster,
    wins = 0,
    losses = 0,
    ties = 0,
    moves = 0,
    waiverRank,
  }) {
    this._id = _id;
    this.leagueId = leagueId;
    this.walletId = walletId;
    this.name = name;
    this.roster = roster;
    this.wins = wins;
    this.losses = losses;
    this.ties = ties;
    this.moves = moves;
    this.waiverRank = waiverRank;
  }

  public static async create(props: TeamProps): Promise<Result<Team>> {
    this.logger.log(`create team`);

    const team = new Team(props);
    const errors = await validate(team);
    this.logger.log(`validated create team`);

    if (errors.length > 0) {
      return Result.fail<Team>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Team>(team);
  }
}
