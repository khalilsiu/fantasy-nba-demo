import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameMapper } from 'src/module/players/game.mapper';
import { Game } from '../../../domain/game';
import { GameRepo } from '../../game.repo';
import { GameDocument } from './schemas/game.schema';

@Injectable()
export class MongoGameRepo implements GameRepo {
  private readonly logger = new Logger(MongoGameRepo.name);

  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async bulkUpsertGame(games: Game[]): Promise<void> {
    this.logger.log(`bulkUpsertGame game ${games.length}`);
    const ops = games.map(({ gameId, ...rest }) => {
      return {
        updateOne: {
          filter: { gameId },
          update: {
            $set: rest,
          },
          upsert: true,
        },
      };
    });

    await this.gameModel.bulkWrite(ops);

    this.logger.log(`bulkUpsertGame successful`);
  }

  async findGameByGameId(gameId: number): Promise<Game | null> {
    this.logger.log(`getGamesByGameId playerId ${gameId}`);
    const game = await this.gameModel.findOne({ gameId });
    if (!game) {
      return null;
    }
    return GameMapper.mapGameToDomain(game);
  }
}
