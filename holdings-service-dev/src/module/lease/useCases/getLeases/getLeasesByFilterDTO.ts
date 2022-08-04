import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PositiveNumberFilter, SortOrder } from 'src/shared/mongo/interfaces';
import { LeaseStatus } from '../../domain/lease';

enum LeaseSortFields {
  rentAmount = 'rent_amount',
  deposit = 'deposit',
  minLeaseLength = 'min_lease_length',
  maxLeaseLength = 'max_lease_length',
  createdAt = 'created_at',
}
export class GetLeaseSort {
  @IsEnum(LeaseSortFields)
  field: LeaseSortFields;

  @IsEnum(SortOrder)
  order: SortOrder;
}

export class GetLeaseDTO {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  readonly lessor?: string;

  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  readonly lessee?: string;

  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly contractAddress: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly tokenIds?: string[];

  @IsEnum(LeaseStatus)
  @IsOptional()
  readonly status?: LeaseStatus;

  @IsBoolean()
  @IsOptional()
  readonly isRentOverdue?: boolean;

  @Type(() => PositiveNumberFilter)
  @ValidateNested({ each: true })
  @IsOptional()
  readonly finalLeaseLength?: PositiveNumberFilter;

  @ValidateNested({ each: true })
  @Type(() => GetLeaseSort)
  @IsOptional()
  @IsArray()
  readonly sort?: GetLeaseSort[];
}
