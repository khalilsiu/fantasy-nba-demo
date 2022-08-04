import { Logger } from '@nestjs/common';
import {
  IsEthereumAddress,
  IsNumberString,
  Length,
  validate,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

export interface HolderProps {
  address: string;
  tokenId: string;
  contractAddress: string;
}

export class Holder {
  @IsEthereumAddress()
  @Length(2, 255)
  readonly address: string;

  @IsEthereumAddress()
  @Length(2, 255)
  readonly contractAddress: string;

  @IsNumberString()
  @Length(2, 255)
  readonly tokenId: string;

  static readonly logger = new Logger(Holder.name);
  constructor({ address, tokenId, contractAddress }) {
    this.address = address;
    this.tokenId = tokenId;
    this.contractAddress = contractAddress;
  }

  public static async create(props: HolderProps): Promise<Result<Holder>> {
    this.logger.log(`create HolderProps ${JSON.stringify(props)}`);
    const holder = new Holder(props);
    this.logger.log(`create Holder ${JSON.stringify(holder)}`);

    const errors = await validate(Holder);

    if (errors.length > 0) {
      return Result.fail<Holder>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Holder>(holder);
  }
}
