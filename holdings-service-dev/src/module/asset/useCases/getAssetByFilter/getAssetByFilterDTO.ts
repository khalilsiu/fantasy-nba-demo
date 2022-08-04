import { ComparisonOperators } from 'src/shared/mongo/interfaces';
import {
  Length,
  IsEthereumAddress,
  IsArray,
  IsOptional,
  ValidateNested,
  IsString,
  IsEnum,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TraitFilter {
  @IsString()
  traitType: string;

  @Allow()
  value: any;

  @IsEnum(ComparisonOperators)
  operator: ComparisonOperators;
}

export class GetFloorAssetByFilterDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => TraitFilter)
  traits: TraitFilter[];
}
