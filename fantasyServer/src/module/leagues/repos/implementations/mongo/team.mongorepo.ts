import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMapper } from 'src/module/leagues/mappers/team.mapper';
import { generateMongooseId } from 'src/shared/utils';
import { Team } from '../../../domain/team';
import { TeamRepo } from '../../team.repo';
import { TeamDocument } from './schemas/team.schema';

@Injectable()
export class MongoTeamRepo implements TeamRepo {
  private readonly logger = new Logger(MongoTeamRepo.name);

  constructor(
    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,
  ) {}

  async bulkUpsertTeam(teams: Team[]): Promise<void> {
    this.logger.log(`bulkUpsertTeam team ${teams.length}`);
    const ops = teams.map(({ _id, ...rest }) => {
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

    await this.teamModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertTeam successful`);
  }

  async findTeamById(teamId: string): Promise<Team | null> {
    this.logger.log(`findTeamById teamId ${teamId}`);
    const team = await this.teamModel.findOne({ _id: teamId });
    if (!team) {
      return null;
    }
    return TeamMapper.mapTeamToDomain(team);
  }
}
