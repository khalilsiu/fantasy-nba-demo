import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { FetchPlayersUseCase } from './useCases/fetchPlayers/fetchPlayersUseCase';
import { FetchPlayerStatsUseCase } from './useCases/fetchPlayerStats/fetchPlayerStatsUseCase';

@Module({
  controllers: [DataController],
  providers: [FetchPlayersUseCase, FetchPlayerStatsUseCase],
})
export class DataModule {}
