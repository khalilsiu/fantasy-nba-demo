import {
  Length,
  IsEthereumAddress,
  IsOptional,
  IsArray,
} from 'class-validator';
import { HolderProps } from '../../domain/holder';

export class GetHoldingsDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  @IsOptional()
  contractAddress?: string;
}

export class GetHoldingsResDTO {
  @Length(2, 255)
  status: string;
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;
  @IsArray()
  holdings: HolderProps[];
}
