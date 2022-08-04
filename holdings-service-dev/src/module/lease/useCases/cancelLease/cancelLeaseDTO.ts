import { Transform } from 'class-transformer';
import { IsBoolean, IsEthereumAddress, IsString } from 'class-validator';

export class CancelLeaseDTO {
  @IsString()
  readonly tokenId: string;

  @IsBoolean()
  readonly regenerate: boolean;

  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly contractAddress: string;
}
