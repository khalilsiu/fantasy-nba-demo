import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolderModule } from './module/holder/holder.module';
import { ConfigModule } from '@nestjs/config';
import { ContractStateModule } from './module/contractState/contractState.module';
import { ContractModule } from './module/contract/contract.module';
import { AssetModule } from './module/asset/asset.module';
import { WinstonModule } from 'nest-winston';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionModule } from './module/transaction/transaction.module';
import { LeaseModule } from './module/lease/lease.module';
import { StatsModule } from './module/stats/stats.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    HolderModule,
    ContractStateModule,
    ContractModule,
    AssetModule,
    WinstonModule,
    ScheduleModule.forRoot(),
    StatsModule,
    TransactionModule,
    LeaseModule,
  ],
  providers: [Logger],
})
export class AppModule {}
