import {
  Length,
  IsEthereumAddress,
  IsNumber,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';
import { STATUS } from '../../domain/contract';

export class GetContractDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;
}

export class GetContractResDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @IsNumber()
  blockNumber: number;

  @Length(2, 255)
  @IsEnum(STATUS)
  status: STATUS;

  @IsArray()
  @IsString({ each: true })
  signatures: string[];
}
