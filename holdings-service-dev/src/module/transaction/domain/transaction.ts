import { Logger } from '@nestjs/common';
import {
  IsDate,
  IsEthereumAddress,
  IsNumber,
  IsString,
  Length,
  validate,
} from 'class-validator';
import { PaymentToken, User } from 'src/module/asset/domain/asset';
import { Result } from 'src/shared/core/Result';

export interface TransactionProps {
  address: string;
  tokenId: string;
  paymentToken: PaymentToken;
  fromAccount: User;
  toAccount: User;
  totalPrice: string;
  transactionHash: string;
  timestamp: Date;
}

export class Transaction {
  @IsEthereumAddress()
  @Length(2, 255)
  readonly address: string;

  @IsString()
  readonly tokenId: string;

  readonly paymentToken: PaymentToken;

  readonly fromAccount: User;

  readonly toAccount: User;

  @IsString()
  readonly totalPrice: string;

  @IsString()
  readonly transactionHash: string;

  @IsDate()
  readonly timestamp: Date;

  @IsNumber()
  readonly priceInEth: number;

  static readonly logger = new Logger(Transaction.name);
  constructor({
    address,
    tokenId,
    paymentToken,
    fromAccount,
    toAccount,
    totalPrice,
    transactionHash,
    timestamp,
    priceInEth,
  }) {
    this.address = address;
    this.tokenId = tokenId;
    this.paymentToken = paymentToken;
    this.fromAccount = fromAccount;
    this.toAccount = toAccount;
    this.totalPrice = totalPrice;
    this.transactionHash = transactionHash;
    this.timestamp = timestamp;
    this.priceInEth = priceInEth;
  }

  public static async create(
    props: TransactionProps,
  ): Promise<Result<Transaction>> {
    this.logger.log(`create TransactionProps ${JSON.stringify(props)}`);

    const { totalPrice, paymentToken } = props;
    const priceInEth =
      (parseInt(totalPrice, 10) * parseFloat(paymentToken.ethPrice)) /
      10 ** paymentToken.decimals;

    const transaction = new Transaction({ ...props, priceInEth });
    this.logger.log(`create transaction ${JSON.stringify(transaction)}`);

    const errors = await validate(Transaction);

    if (errors.length > 0) {
      return Result.fail<Transaction>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Transaction>(transaction);
  }
}
