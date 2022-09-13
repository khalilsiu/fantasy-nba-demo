import { Logger } from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { snakeize } from 'src/shared/utils';
import { Lease } from './domain/lease';
import { LeaseDocument } from './repos/implementations/mongo/schemas/lease.schema';
import { AssetWithLease } from './useCases/getLeases/getLeasesByFilterUseCase';

export class LeaseMapper {
  static readonly logger = new Logger(LeaseMapper.name);

  static async toDomain(props: LeanDocument<LeaseDocument>): Promise<Lease> {
    const leaseOrError = await Lease.create({
      ...props,
      _id: (props as any)._id.toString(),
    });
    this.logger.log(`toDomain leaseOrError ${JSON.stringify(leaseOrError)}`);

    if (leaseOrError.isFailure) {
      throw new Error(
        `LeaseMapper map to domain failed. ${leaseOrError.error()}`,
      );
    }
    return leaseOrError.getValue();
  }

  static toDTO(lease: Lease) {
    return snakeize(lease);
  }
}

export class AssetWithLeaseMapper {
  static readonly logger = new Logger(LeaseMapper.name);

  static toDTO(assetWithLease: AssetWithLease) {
    return snakeize(assetWithLease);
  }
}
