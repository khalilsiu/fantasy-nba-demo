import { Module } from '@nestjs/common';
import { FetchFromSourceUseCase } from './useCases/fetchFromSource/fetchFromSourceUseCase';
import { AssetController } from './asset.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset } from './domain/asset';
import { AssetSchema } from './repos/implementations/mongo/schemas/asset.schema';
import { ASSET_REPO } from './repos/asset.repo';
import { MongoAssetRepo } from './repos/implementations/mongo/asset.mongorepo';
import { ContractModule } from '../contract/contract.module';
import { GetAssetByFilterUseCase } from './useCases/getAssetByFilter/getAssetByFilterUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    ContractModule,
  ],
  controllers: [AssetController],
  providers: [
    FetchFromSourceUseCase,
    GetAssetByFilterUseCase,
    {
      provide: ASSET_REPO,
      useClass: MongoAssetRepo,
    },
  ],
  exports: [FetchFromSourceUseCase, GetAssetByFilterUseCase],
})
export class AssetModule {}
