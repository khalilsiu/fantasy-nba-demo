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
  commissionerWalletId: string;

  @IsNumber()
  commissionerFee: number;

  @IsNumber()
  entryFee: number;
}

export default class UpsertLeaguesDTO {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpsertLeagueDTO)
  leagues: UpsertLeagueDTO[];
}
