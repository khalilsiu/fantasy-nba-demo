import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  Length,
  validate,
  ValidateNested,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

class Birth {
  @Length(2, 255)
  date: string;

  @Length(2, 255)
  country: string;
}

class Nba {
  @IsNumber()
  start: number;

  @IsNumber()
  pro: number;
}

class Height {
  @Length(2, 255)
  country: string;

  @Length(2, 255)
  feets: string;

  @Length(2, 255)
  inches: string;

  @Length(2, 255)
  meters: string;
}

class Weight {
  @Length(2, 255)
  pounds: string;

  @Length(2, 255)
  kilograms: string;
}

export interface PlayerProps {
  id: number;
  firstname: string;
  lastname: string;
  birth: Birth;
  nba: Nba;
  height: Height;
  weight: Weight;
  college: string;
  affiliation: string;
  jersey: number;
  active: boolean;
  pos: string;
}

export class Player {
  @IsNumber()
  readonly id: number;

  @IsString()
  @Length(2, 255)
  firstname: string;

  @IsString()
  @Length(2, 255)
  lastname: string;

  @ValidateNested({ each: true })
  @Type(() => Birth)
  birth: Birth;

  @ValidateNested({ each: true })
  @Type(() => Nba)
  nba: Nba;

  @ValidateNested({ each: true })
  @Type(() => Height)
  height: Height;

  @ValidateNested({ each: true })
  @Type(() => Weight)
  weight: Weight;

  @IsString()
  @Length(2, 255)
  college: string;

  @IsString()
  @Length(2, 255)
  affiliation: string;

  @IsNumber()
  jersey: number;

  @IsBoolean()
  active: boolean;

  @IsString()
  @Length(1, 10)
  pos: string;

  static readonly logger = new Logger(Player.name);
  constructor({
    id,
    firstname,
    lastname,
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
    this.firstname = firstname;
    this.lastname = lastname;
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
