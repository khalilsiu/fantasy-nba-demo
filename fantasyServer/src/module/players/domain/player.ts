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

class Birth {
  @Length(2, 255)
  date?: string;

  @Length(2, 255)
  country?: string;
}

class Nba {
  @IsNumber()
  start: number;

  @IsNumber()
  pro: number;
}

class Height {
  @IsOptional()
  @Length(2, 255)
  feets?: string;

  @IsOptional()
  @Length(2, 255)
  inches?: string;

  @IsOptional()
  @Length(2, 255)
  meters?: string;
}

class Weight {
  @Length(2, 255)
  @IsOptional()
  pounds?: string;

  @Length(2, 255)
  @IsOptional()
  kilograms?: string;
}

export interface PlayerProps {
  id: number;
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
  readonly id: number;

  @IsString()
  @Length(2, 255)
  readonly firstName: string;

  @IsString()
  @Length(2, 255)
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
  @Length(2, 255)
  readonly college: string;

  @IsString()
  @Length(2, 255)
  readonly affiliation: string;

  @IsNumber()
  @IsOptional()
  readonly jersey: number;

  @IsBoolean()
  @IsOptional()
  readonly active: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 10)
  readonly pos: string;

  static readonly logger = new Logger(Player.name);
  constructor({
    id,
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
    this.id = id;
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
    this.logger.log(`create PlayerProps ${JSON.stringify(props)}`);

    const player = new Player(props);
    this.logger.log(`created Player`);

    const errors = await validate(Player);

    if (errors.length > 0) {
      return Result.fail<Player>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Player>(player);
  }
}
