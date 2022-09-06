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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: GameLog.name, schema: GameLogSchema },
    ]),
  ],
  controllers: [],
  providers: [
    FetchPlayersAndGameLogsUseCase,
    {
      provide: PLAYER_REPO,
      useClass: MongoPlayerRepo,
    },
    {
      provide: GAME_LOG_REPO,
      useClass: MongoGameLogRepo,
    },
  ],
})
export class PlayerModule {}
