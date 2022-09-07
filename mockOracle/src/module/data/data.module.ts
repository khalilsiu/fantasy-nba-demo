import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { FetchGamesUseCase } from './useCases/fetchGames/fetchGamesUseCase';
import { FetchPlayersUseCase } from './useCases/fetchPlayers/fetchPlayersUseCase';
import { FetchPlayerStatsUseCase } from './useCases/fetchPlayerStats/fetchPlayerStatsUseCase';

@Module({
  controllers: [DataController],
  providers: [FetchPlayersUseCase, FetchPlayerStatsUseCase, FetchGamesUseCase],
})
export class DataModule {}
