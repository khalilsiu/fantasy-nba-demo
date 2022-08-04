import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionMapper } from 'src/module/transaction/transaction.mapper';
import { Transaction } from '../../../domain/transaction';
import { TransactionRepo } from '../../transaction.repo';
import { TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class MongoTransactionRepo implements TransactionRepo {
  private readonly logger = new Logger(MongoTransactionRepo.name);

  constructor(
    @InjectModel(Transaction.name)
    private TransactionModel: Model<TransactionDocument>,
  ) {}

  logTransaction = async (transaction: Transaction) => {
    const transactionDoc = new this.TransactionModel(transaction);
    const saved = await transactionDoc.save();
    return TransactionMapper.toDomain(saved.toObject());
  };
}
