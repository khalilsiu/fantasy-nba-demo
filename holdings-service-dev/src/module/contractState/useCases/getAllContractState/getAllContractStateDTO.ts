import { IsEthereumAddress, IsArray } from 'class-validator';

export class GetAllContractStateDTO {
  @IsArray()
  @IsEthereumAddress({ each: true })
  addresses: string[];
}
