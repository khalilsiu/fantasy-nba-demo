import { Logger } from '@nestjs/common';
import { snakeize } from 'src/shared/utils';
import { Transaction } from './domain/transaction';

export class TransactionMapper {
  static readonly logger = new Logger(TransactionMapper.name);

  static async toDomain(doc: any): Promise<Transaction> {
    const transactionOrError = await Transaction.create(doc);
    this.logger.log(
      `toDomain transactionOrError isSuccess ${transactionOrError.isSuccess}`,
    );

    if (transactionOrError.isFailure) {
      throw new Error('TransactionMapper map to domain failed.');
    }
    return transactionOrError.getValue();
  }

  static async toDTO(transaction: Transaction) {
    return snakeize(transaction);
  }
}
