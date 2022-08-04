import { Transform } from 'class-transformer';
import {
  IsEthereumAddress,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import {
  IsBiggerThanOrEqualTo,
  IsSmallerThanOrEqualTo,
} from 'src/shared/customDecorators';
import { AcceptedTokens } from '../../constants/AcceptedToken';

export class UpsertLeaseDTO {
  @IsNumber()
  @IsPositive()
  readonly rentAmount: number;

  @IsPositive()
  @IsNumber()
  readonly deposit: number;

  @IsPositive()
  @IsNumber()
  @Min(7)
  readonly gracePeriod: number;

  @IsNumber()
  @IsPositive()
  @IsSmallerThanOrEqualTo('maxLeaseLength')
  readonly minLeaseLength: number;

  @IsNumber()
  @IsPositive()
  @IsBiggerThanOrEqualTo('minLeaseLength')
  readonly maxLeaseLength: number;

  @IsEnum(AcceptedTokens)
  readonly rentToken: AcceptedTokens;

  @IsBoolean()
  readonly autoRegenerate: boolean;

  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly lessor: string;

  @IsString()
  readonly tokenId: string;

  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly contractAddress: string;
}
