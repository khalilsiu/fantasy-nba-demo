import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameLogMapper } from 'src/module/players/gameLog.mapper';
import { GameLog } from '../../../domain/gameLog';
import { GameLogRepo } from '../../gameLog.repo';
import { GameLogDocument } from './schemas/gameLog.schema';

@Injectable()
export class MongoGameLogRepo implements GameLogRepo {
  private readonly logger = new Logger(MongoGameLogRepo.name);

  constructor(
    @InjectModel(GameLog.name)
    private gameLogModel: Model<GameLogDocument>,
  ) {}

  async bulkUpsertGameLog(gameLogs: GameLog[]): Promise<void> {
    this.logger.log(`bulkUpsertGameLog gameLog ${gameLogs.length}`);
    const ops = gameLogs.map(({ gameId, playerId, ...rest }) => {
      return {
        updateOne: {
          filter: { gameId, playerId },
          update: {
            $set: rest,
          },
          upsert: true,
        },
      };
    });

    await this.gameLogModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertGameLog successful`);
  }

  async getGameLogsByPlayerId(playerId: number): Promise<GameLog[]> {
    this.logger.log(`getGameLogsByPlayerId playerId ${playerId}`);
    const gameLogs = await this.gameLogModel.find({ playerId });
    return Promise.all(
      gameLogs.map((gameLog) => GameLogMapper.mapGameLogToDomain(gameLog)),
    );
  }
}
