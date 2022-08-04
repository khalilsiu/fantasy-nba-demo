import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Transaction, TransactionProps } from '../../domain/transaction';
import {
  TransactionRepo,
  TRANSACTION_REPO,
} from '../../repos/transaction.repo';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Transaction>
>;

@Injectable()
export class LogTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPO) private transactionRepo: TransactionRepo,
  ) {}
  private readonly logger = new Logger(LogTransactionUseCase.name);
  public async exec(payload: TransactionProps): Promise<Response> {
    try {
      this.logger.log(`LogTransaction`);

      const transactionObjectOrError = await Transaction.create(payload);
      if (transactionObjectOrError.isFailure) {
        return left(
          new DomainModelCreationError(
            transactionObjectOrError.error.toString(),
          ),
        );
      }

      const transaction = transactionObjectOrError.getValue();

      this.logger.log(`LogTransaction created`);
      const saved = await this.transactionRepo.logTransaction(transaction);

      this.logger.log(`LogTransaction successfully created`);
      return right(Result.ok<Transaction>(saved));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
