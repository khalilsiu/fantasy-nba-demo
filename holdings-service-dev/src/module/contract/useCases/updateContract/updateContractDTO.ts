import { Type } from 'class-transformer';
import {
  Length,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { FeatureKeys } from '../../constant/FeatureKeys';
import { BotConfig, STATUS } from '../../domain/contract';

export class UpdateContractDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @IsOptional()
  @Length(2, 255)
  @IsEnum(STATUS)
  status?: string;

  @IsNumber()
  @IsOptional()
  blockNumber?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  signatures?: string[];

  @IsArray()
  @IsOptional()
  @IsEnum(FeatureKeys, { each: true })
  featureKeys?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BotConfig)
  botConfig?: BotConfig[];
}

export class UpdateContractQueryDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;
}

export class UpdateContractBodyDTO {
  @IsOptional()
  @Length(2, 255)
  @IsEnum(STATUS)
  status?: string;

  @IsNumber()
  @IsOptional()
  blockNumber?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  signatures?: string[];

  @IsArray()
  @IsOptional()
  @IsEnum(FeatureKeys, { each: true })
  featureKeys?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BotConfig)
  botConfig?: BotConfig[];
}
