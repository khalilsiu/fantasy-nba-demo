import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  NotEquals,
} from 'class-validator';
import { boolStringToBool } from 'src/shared/customDecorators';

export enum GetLeaguesSortableFields {
  _id = '_id',
  createdAt = 'createdAt',
  draftDateTime = 'draftDateTime',
}

export default class GetLeaguesDTO {
  @IsString()
  @IsOptional()
  commissionerWalletAddress?: string;

  @Transform(boolStringToBool)
  @IsOptional()
  @IsBoolean()
  drafted?: boolean;

  @Transform(boolStringToBool)
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsEnum(GetLeaguesSortableFields)
  @IsOptional()
  sortBy?: GetLeaguesSortableFields;

  @Type(() => Number)
  @IsNumber()
  @Min(-1)
  @NotEquals(0)
  @Max(1)
  @IsOptional()
  order?: -1 | 1;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  showDeleted?: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset?: number;
}
