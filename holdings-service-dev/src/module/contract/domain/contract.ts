import { Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  validate,
  ValidateNested,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';
import { FeatureKeys } from '../constant/FeatureKeys';

export interface ContractProps {
  address: string;
  blockNumber: number;
  status: string;
  signatures?: string[];
  featureKeys: string[];
  botConfig?: BotConfig[];
}

export enum STATUS {
  READY,
  UPDATING,
}

export class BotConfig {
  @IsEnum(FeatureKeys)
  type: string;

  @Length(2, 255)
  token: string;
}

export class Contract {
  @IsEthereumAddress()
  @Length(2, 255)
  readonly address: string;

  @IsNumber()
  readonly blockNumber: number;

  @Length(2, 255)
  @IsEnum(STATUS)
  readonly status: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly signatures?: string[];

  @IsArray()
  @IsOptional()
  @IsEnum(FeatureKeys, { each: true })
  readonly featureKeys: FeatureKeys[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BotConfig)
  readonly botConfig: BotConfig[];

  static readonly logger = new Logger(Contract.name);
  constructor(
    address,
    blockNumber,
    status,
    signatures,
    featureKeys,
    botConfig,
  ) {
    this.address = address;
    this.blockNumber = blockNumber;
    this.status = status;
    this.signatures = signatures;
    this.featureKeys = featureKeys;
    this.botConfig = botConfig;
  }

  public static async create(props: ContractProps): Promise<Result<Contract>> {
    this.logger.log(`create ContractProps ${JSON.stringify(props)}`);
    const { address, blockNumber, status, signatures, featureKeys, botConfig } =
      props;
    const contract = new Contract(
      address,
      blockNumber,
      status,
      signatures,
      featureKeys,
      botConfig,
    );
    this.logger.log(`create Contract ${JSON.stringify(contract)}`);

    const errors = await validate(contract);

    if (errors.length > 0) {
      return Result.fail<Contract>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Contract>(contract);
  }
}
