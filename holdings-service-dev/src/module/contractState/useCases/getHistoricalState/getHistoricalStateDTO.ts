import { Type } from 'class-transformer';
import { Length, IsEthereumAddress, IsNumber, Min } from 'class-validator';

export class GetHistoricalStateDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;
}
