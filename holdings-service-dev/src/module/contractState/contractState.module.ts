import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UpsertStateFromOpenSeaUseCase } from './useCases/upsertStateFromOpenSea/upsertStateFromOpenSeaUseCase';
import { ContractState } from './domain/contractState';
import { ContractStateSchema } from './repos/implementations/mongo/schemas/contractState.schema';
import { ContractStateController } from './contractState.controller';
import { CONTRACTSTATE_REPO } from './repos/contractState.repo';
import { MongoContractStateRepo } from './repos/implementations/mongo/contractState.mongorepo';
import { ContractModule } from '../contract/contract.module';
import { GetContractStateUseCase } from './useCases/getContractState/getContractStateUseCase';
import { GetHistoricalStateUseCase } from './useCases/getHistoricalState/getHistoricalStateUseCase';
import { GetAllContractStateUseCase } from './useCases/getAllContractState/getAllContractStateUseCase';

@Module({
  imports: [
    ContractModule,
    MongooseModule.forFeature([
      { name: ContractState.name, schema: ContractStateSchema },
    ]),
  ],
  controllers: [ContractStateController],
  providers: [
    UpsertStateFromOpenSeaUseCase,
    GetContractStateUseCase,
    GetAllContractStateUseCase,
    GetHistoricalStateUseCase,
    {
      provide: CONTRACTSTATE_REPO,
      useClass: MongoContractStateRepo,
    },
  ],
  exports: [GetAllContractStateUseCase],
})
export class ContractStateModule {}
