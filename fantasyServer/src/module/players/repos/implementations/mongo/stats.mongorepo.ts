import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stats } from '../../../domain/stats';
import { StatsRepo } from '../../stats.repo';
import { StatsDocument } from './schemas/stats.schema';

@Injectable()
export class MongoStatsRepo implements StatsRepo {
  private readonly logger = new Logger(MongoStatsRepo.name);

  constructor(
    @InjectModel(Stats.name)
    private statsModel: Model<StatsDocument>,
  ) {}

  async bulkUpsertStats(stats: Stats[]): Promise<void> {
    this.logger.log(`bulkUpsertStats stats ${stats.length}`);
    const ops = stats.map(({ playerId, ...rest }) => {
      return {
        updateOne: {
          filter: { playerId },
          update: {
            $set: rest,
          },
          upsert: true,
        },
      };
    });

    await this.statsModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertStats successful`);
  }
}
