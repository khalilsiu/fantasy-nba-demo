import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolderController } from './holder.controller';
import { HOLDER_REPO } from './repos/holder.repo';
import { MongoHolderRepo } from './repos/implementations/mongo/holder.mongorepo';
import {
  Holder,
  HolderSchema,
} from './repos/implementations/mongo/schemas/holder.schema';
import { GetHoldingsUseCase } from './useCases/getHoldings/getHoldingsUseCase';
import { Web3Module } from '../web3/web3.module';
import { WEB3_SERVICE, Web3Service } from '../web3/Web3Service';
import { ContractModule } from '../contract/contract.module';
import { UpdateAllContractHoldingsUseCase } from './useCases/updateAllContractHoldings/updateAllContractHoldingsUseCase';

@Module({
  imports: [
    Web3Module,
    ContractModule,
    MongooseModule.forFeature([{ name: Holder.name, schema: HolderSchema }]),
  ],
  controllers: [HolderController],
  providers: [
    UpdateAllContractHoldingsUseCase,
    GetHoldingsUseCase,
    {
      provide: WEB3_SERVICE,
      useClass: Web3Service,
    },
    {
      provide: HOLDER_REPO,
      useClass: MongoHolderRepo,
    },
  ],
})
export class HolderModule {}
