import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GetContractUseCase } from './useCases/getContract/getContractUseCase';
import { BotConfig, Contract } from './domain/contract';
import { CONTRACT_REPO } from './repos/contract.repo';
import { MongoContractRepo } from './repos/implementations/mongo/contract.mongorepo';
import {
  BotConfigSchema,
  ContractSchema,
} from './repos/implementations/mongo/schemas/contract.schema';
import { ContractController } from './contract.controller';
import { GetAllContractsUseCase } from './useCases/getAllContracts/getAllContractsUseCase';
import { CreateContractUseCase } from './useCases/createContract/createContractUseCase';
import { UpdateContractUseCase } from './useCases/updateContract/updateContractUseCase';
import { ContractStateModule } from '../contractState/contractState.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
      { name: BotConfig.name, schema: BotConfigSchema },
    ]),
  ],
  controllers: [ContractController],
  providers: [
    GetContractUseCase,
    GetAllContractsUseCase,
    CreateContractUseCase,
    UpdateContractUseCase,
    {
      provide: CONTRACT_REPO,
      useClass: MongoContractRepo,
    },
  ],
  exports: [
    GetContractUseCase,
    GetAllContractsUseCase,
    UpdateContractUseCase,
    CreateContractUseCase,
  ],
})
export class ContractModule {}
