import { Length, IsEthereumAddress, IsString } from 'class-validator';
export class FetchFromSourceDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @IsString()
  tokenId: string;
}
