import { Transaction } from '../domain/transaction';

export const TRANSACTION_REPO = 'TRANSACTION REPO';

export interface TransactionRepo {
  logTransaction(transaction: Transaction): Promise<Transaction>;
}
