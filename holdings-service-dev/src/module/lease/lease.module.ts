import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GetLeasesByFilterUseCase } from './useCases/getLeases/getLeasesByFilterUseCase';
import { Lease } from './domain/lease';
import { UpsertLeaseUseCase } from './useCases/upsertLease/upsertLeaseUseCase';
import { LeaseController } from './lease.controller';
import { MongoLeaseRepo } from './repos/implementations/mongo/lease.mongorepo';
import { LeaseSchema } from './repos/implementations/mongo/schemas/lease.schema';
import { LEASE_REPO } from './repos/lease.repo';
import { WSGateway } from '../ws/wsGateway';
import { AssetModule } from '../asset/asset.module';
import { AcceptLeaseUseCase } from './useCases/acceptLease/acceptLeaseUseCase';
import { PayRentUseCase } from './useCases/payRent/payRentUseCase';
import { CancelLeaseUseCase } from './useCases/cancelLease/cancelLeaseUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lease.name, schema: LeaseSchema }]),
    WSGateway,
    AssetModule,
  ],
  controllers: [LeaseController],
  providers: [
    UpsertLeaseUseCase,
    GetLeasesByFilterUseCase,
    AcceptLeaseUseCase,
    PayRentUseCase,
    CancelLeaseUseCase,
    WSGateway,
    {
      provide: LEASE_REPO,
      useClass: MongoLeaseRepo,
    },
  ],
})
export class LeaseModule {}
