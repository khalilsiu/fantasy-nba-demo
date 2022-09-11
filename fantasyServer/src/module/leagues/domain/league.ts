import { Logger } from '@nestjs/common';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  Max,
  Min,
  validate,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';
import { Type } from 'class-transformer';
import { SEASON_START_2022 } from 'src/shared/constants';
import { subDays } from 'date-fns';
import { generateMongooseId } from 'src/shared/utils';

export interface LeagueProps {
  _id?: string;
  name?: string;
  teamIds?: number[];
  draftDateTime?: Date;
  maxTeams?: number;
  commissionerWalletId: string;
  commissionerFee: number;
  entryFee: number;
  createdAt?: Date;
  deletedAt?: Date;
}

export class League {
  @IsString()
  readonly _id: string;

  @IsString()
  readonly name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  readonly teamIds: number[];

  @IsDate()
  readonly draftDateTime: Date;

  @IsNumber()
  @Max(12)
  @Min(5)
  readonly maxTeams: number;

  @IsString()
  readonly commissionerWalletId: string;

  @IsNumber()
  @Min(0)
  readonly commissionerFee: number;

  @IsNumber()
  @Min(0)
  readonly entryFee: number;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly deletedAt?: Date;

  static readonly logger = new Logger(League.name);
  constructor({
    _id,
    name = 'Your Dream League',
    teamIds = [],
    draftDateTime,
    maxTeams = 5,
    commissionerWalletId,
    commissionerFee,
    entryFee,
    createdAt,
    deletedAt,
  }: LeagueProps) {
    this._id = _id;
    this.name = name;
    this.teamIds = teamIds;
    this.draftDateTime = draftDateTime;
    this.maxTeams = maxTeams;
    this.commissionerWalletId = commissionerWalletId;
    this.commissionerFee = commissionerFee;
    this.entryFee = entryFee;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  public static async create(props: LeagueProps): Promise<Result<League>> {
    this.logger.log(`create league props ${JSON.stringify(props)}`);
    const newUser = !props._id && !props.createdAt;
    let _id = props._id;
    let createdAt = props.createdAt;
    let draftDateTime = props.draftDateTime;

    if (newUser) {
      _id = generateMongooseId();
      createdAt = new Date();
    }

    if (!props.draftDateTime) {
      draftDateTime = subDays(new Date(SEASON_START_2022), 4);
    }

    const league = new League({
      ...props,
      _id,
      draftDateTime,
      createdAt,
    });
    const errors = await validate(league);
    this.logger.log(`validated create league`);

    if (errors.length > 0) {
      return Result.fail<League>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<League>(league);
  }
}
