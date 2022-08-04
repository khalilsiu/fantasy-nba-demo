import { Type } from 'class-transformer';
import {
  Length,
  IsEthereumAddress,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { FeatureKeys } from '../../constant/FeatureKeys';
import { BotConfig } from '../../domain/contract';

export class CreateContractDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  signatures?: string[];

  @IsArray()
  @IsOptional()
  @IsEnum(FeatureKeys, { each: true })
  featureKeys: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BotConfig)
  botConfig: BotConfig[];
}

export class CreateContractQueryDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;
}

export class CreateContractBodyDTO {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  signatures?: string[];

  @IsArray()
  @IsOptional()
  @IsEnum(FeatureKeys, { each: true })
  featureKeys: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BotConfig)
  botConfig: BotConfig[];
}
