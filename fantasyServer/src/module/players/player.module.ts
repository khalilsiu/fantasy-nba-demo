import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player } from './domain/Player';
import { GameLog } from './domain/gameLog';
import { MongoPlayerRepo } from './repos/implementations/mongo/player.mongorepo';
import { MongoGameLogRepo } from './repos/implementations/mongo/gameLog.mongorepo';
import { PlayerSchema } from './repos/implementations/mongo/schemas/player.schema';
import { GameLogSchema } from './repos/implementations/mongo/schemas/gameLog.schema';
import { PLAYER_REPO } from './repos/player.repo';
import { GAME_LOG_REPO } from './repos/gameLog.repo';
import { FetchPlayersAndGameLogsUseCase } from './useCases/fetchPlayersAndGameLogs/fetchPlayersAndGameLogsUseCase';
import { Game } from './domain/game';
import { GAME_REPO } from './repos/game.repo';
import { MongoGameRepo } from './repos/implementations/mongo/game.mongorepo';
import { GameSchema } from './repos/implementations/mongo/schemas/game.schema';
import { AggregateStatsUseCase } from './useCases/aggregateStats/aggregateStats';
import { StatsSchema } from './repos/implementations/mongo/schemas/stats.schema';
import { Stats } from './domain/stats';
import { MongoStatsRepo } from './repos/implementations/mongo/stats.mongorepo';
import { STATS_REPO } from './repos/stats.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: GameLog.name, schema: GameLogSchema },
      { name: Game.name, schema: GameSchema },
      { name: Stats.name, schema: StatsSchema },
    ]),
  ],
  controllers: [],
  providers: [
    FetchPlayersAndGameLogsUseCase,
    AggregateStatsUseCase,
    {
      provide: PLAYER_REPO,
      useClass: MongoPlayerRepo,
    },
    {
      provide: GAME_LOG_REPO,
      useClass: MongoGameLogRepo,
    },
    {
      provide: GAME_REPO,
      useClass: MongoGameRepo,
    },
    {
      provide: STATS_REPO,
      useClass: MongoStatsRepo,
    },
  ],
})
export class PlayerModule {}
