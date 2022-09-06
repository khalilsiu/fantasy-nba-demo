import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../../../domain/Player';
import { PlayerRepo } from '../../player.repo';
import { PlayerDocument } from './schemas/player.schema';
@Injectable()
export class MongoPlayerRepo implements PlayerRepo {
  private readonly logger = new Logger(MongoPlayerRepo.name);

  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async bulkUpsertPlayers(players: Player[]): Promise<void> {
    this.logger.log(`bulkUpsertPlayer player ${players.length}`);
    const ops = players.map(({ playerId, ...rest }) => {
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

    await this.playerModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertPlayer successful`);
  }

  async getPlayerIds(): Promise<number[]> {
    this.logger.log(`getPlayerIds`);
    const players = await this.playerModel.find({}, { playerId: 1 });
    return players.map((player) => player.player_id);
  }
}
