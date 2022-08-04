import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEthereumAddress,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AcceptLeaseDTO {
  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly lessee: string;

  @IsString()
  readonly tokenId: string;

  @IsNumber()
  @IsPositive()
  readonly finalLeaseLength: number;

  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly contractAddress: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly timestamp: Date;
}
