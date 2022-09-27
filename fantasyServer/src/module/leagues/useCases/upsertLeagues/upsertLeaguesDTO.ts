import { Type } from 'class-transformer';
import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  Max,
  Min,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

export class UpsertLeagueDTO {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  draftDateTime?: string;

  @IsNumber()
  @Min(5)
  @Max(12)
  @IsOptional()
  maxTeams?: number;

  @IsString()
  commissionerWalletAddress: string;

  @IsNumber()
  commissionerFee: number;

  @IsBoolean()
  @Type(() => Boolean)
  isPrivate: boolean;

  @IsNumber()
  entryFee: number;
}

export default class UpsertLeaguesDTO {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpsertLeagueDTO)
  leagues: UpsertLeagueDTO[];
}
