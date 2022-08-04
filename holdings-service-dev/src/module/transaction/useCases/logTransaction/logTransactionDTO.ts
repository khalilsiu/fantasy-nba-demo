import { Type } from 'class-transformer';
import {
  Length,
  IsEthereumAddress,
  IsString,
  IsDateString,
  ValidateNested,
  Allow,
} from 'class-validator';
import { PaymentToken, User } from 'src/module/asset/domain/asset';

export class TxnEvent {
  @IsString()
  token_id: string;

  @Allow()
  payment_token: PaymentToken;

  @Allow()
  from_account: User;

  @Allow()
  to_account: User;

  @IsString()
  total_price: string;

  @IsString()
  transaction_hash: string;

  @IsDateString()
  timestamp: string;
}

export class LogTransactionDTO {
  @IsEthereumAddress()
  @Length(2, 255)
  address: string;

  @ValidateNested({ each: true })
  @Type(() => TxnEvent)
  event: TxnEvent;
}
