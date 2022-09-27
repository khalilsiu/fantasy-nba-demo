import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { LeagueMapper } from 'src/module/leagues/mappers/league.mapper';
import { generateMongooseId } from 'src/shared/utils';
import { League } from '../../../domain/league';
import { FindLeaguesFields, FindOptions, LeagueRepo } from '../../league.repo';
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

  queryBuilder(fields: FindLeaguesFields) {
    const { commissionerWalletAddress, isPrivate, drafted, showDeleted } =
      fields;
    const query: FilterQuery<LeagueDocument> = {};
    if (commissionerWalletAddress) {
      query.commissionerWalletAddress = commissionerWalletAddress;
    }
    if (drafted !== undefined) {
      query.drafted = drafted;
    }
    if (showDeleted !== undefined) {
      query.deletedAt = { $ne: null };
    }
    if (isPrivate !== undefined) {
      query.isPrivate = isPrivate;
    }
    return query;
  }

  async count(fields: FindLeaguesFields): Promise<number> {
    this.logger.log(`count`);
    const query = this.queryBuilder(fields);
    return this.leagueModel.find(query).count();
  }

  async find(
    fields: FindLeaguesFields,
    options?: FindOptions,
  ): Promise<League[]> {
    this.logger.log(`findLeagues`);
    const query = this.queryBuilder(fields);
    console.log('queryyy', query);
    let ops = this.leagueModel.find(query);
    if (options && options.sortBy && options.order) {
      ops = ops.sort({ [options.sortBy]: options.order });
    }
    if (options && options.limit) {
      ops = ops.limit(options.limit);
    }
    if (options && options.offset) {
      ops = ops.skip(options.offset);
    }
    const leagues = await ops;
    return Promise.all(
      leagues.map((league) => LeagueMapper.mapLeagueToDomain(league)),
    );
  }
}
