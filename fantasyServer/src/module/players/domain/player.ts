import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  validate,
  ValidateNested,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

export class Birth {
  @IsString()
  date?: string;

  @IsString()
  country?: string;
}

export class Nba {
  @IsNumber()
  start: number;

  @IsNumber()
  pro: number;
}

export class Height {
  @IsOptional()
  @IsString()
  feets?: string;

  @IsOptional()
  @IsString()
  inches?: string;

  @IsOptional()
  @IsString()
  meters?: string;
}

export class Weight {
  @IsString()
  @IsOptional()
  pounds?: string;

  @IsString()
  @IsOptional()
  kilograms?: string;
}

export interface PlayerProps {
  playerId: number;
  firstName: string;
  lastName: string;
  birth: Birth;
  nba: Nba;
  height: Height;
  weight: Weight;
  college: string;
  affiliation: string;
  jersey?: number;
  active?: boolean;
  pos?: string;
}

export class Player {
  @IsNumber()
  readonly playerId: number;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @ValidateNested({ each: true })
  @Type(() => Birth)
  readonly birth: Birth;

  @ValidateNested({ each: true })
  @Type(() => Nba)
  readonly nba: Nba;

  @ValidateNested({ each: true })
  @Type(() => Height)
  readonly height: Height;

  @ValidateNested({ each: true })
  @Type(() => Weight)
  readonly weight: Weight;

  @IsString()
  readonly college: string;

  @IsString()
  readonly affiliation: string;

  @IsNumber()
  @IsOptional()
  readonly jersey: number;

  @IsBoolean()
  @IsOptional()
  readonly active: boolean;

  @IsString()
  @IsOptional()
  readonly pos: string;

  static readonly logger = new Logger(Player.name);
  constructor({
    playerId,
    firstName,
    lastName,
    birth,
    nba,
    height,
    weight,
    college,
    affiliation,
    jersey,
    active,
    pos,
  }: PlayerProps) {
    this.playerId = playerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birth = birth;
    this.nba = nba;
    this.height = height;
    this.weight = weight;
    this.college = college;
    this.affiliation = affiliation;
    this.jersey = jersey;
    this.active = active;
    this.pos = pos;
  }

  public static async create(props: PlayerProps): Promise<Result<Player>> {
    this.logger.log(`create player`);

    const player = new Player(props);
    const errors = await validate(Player);
    this.logger.log(`validated player`);

    if (errors.length > 0) {
      return Result.fail<Player>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Player>(player);
  }
}
