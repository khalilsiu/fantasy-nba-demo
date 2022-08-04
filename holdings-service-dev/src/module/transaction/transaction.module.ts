import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Transaction } from './domain/transaction';
import { TransactionSchema } from './repos/implementations/mongo/schemas/transaction.schema';
import { MongoTransactionRepo } from './repos/implementations/mongo/transaction.mongorepo';
import { TRANSACTION_REPO } from './repos/transaction.repo';
import { TransactionController } from './transaction.controller';
import { LogTransactionUseCase } from './useCases/logTransaction/logTransactionUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    LogTransactionUseCase,
    {
      provide: TRANSACTION_REPO,
      useClass: MongoTransactionRepo,
    },
  ],
})
export class TransactionModule {}
