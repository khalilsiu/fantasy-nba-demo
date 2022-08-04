import { Transform } from 'class-transformer';
import { IsEthereumAddress, IsNumber, IsString, Min } from 'class-validator';

export class PayRentDTO {
  @IsString()
  readonly tokenId: string;

  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly contractAddress: string;

  @IsNumber()
  @Min(2)
  readonly monthsPaid: number;
}
