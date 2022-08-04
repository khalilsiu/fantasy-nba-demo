import { Length, IsEthereumAddress } from 'class-validator';

export class GetContractStateDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;
}
