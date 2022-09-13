import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeagueMapper } from 'src/module/leagues/mappers/league.mapper';
import { generateMongooseId } from 'src/shared/utils';
import { League } from '../../../domain/league';
import { LeagueRepo } from '../../league.repo';
import { LeagueDocument } from './schemas/league.schema';

@Injectable()
export class MongoLeagueRepo implements LeagueRepo {
  private readonly logger = new Logger(MongoLeagueRepo.name);

  constructor(
    @InjectModel(League.name)
    private leagueModel: Model<LeagueDocument>,
  ) {}

  async bulkUpsertLeague(leagues: League[]): Promise<void> {
    this.logger.log(`bulkUpsertLeague league ${leagues.length}`);
    const ops = leagues.map(({ _id, ...rest }) => {
      return {
        updateOne: {
          filter: { _id: generateMongooseId(_id) },
          update: {
            $set: rest,
          },
          upsert: true,
        },
      };
    });

    await this.leagueModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertLeague successful`);
  }

  async findLeagueById(leagueId: string): Promise<League | null> {
    this.logger.log(`findLeagueById leagueId ${leagueId}`);
    const league = await this.leagueModel.findOne({ _id: leagueId });
    if (!league) {
      return null;
    }
    return LeagueMapper.mapLeagueToDomain(league);
  }
}
