import { Module } from '@nestjs/common';
import { FetchPlayersAndStatsUseCase } from './useCases/fetchPlayersAndStats/fetchPlayersAndStatsUseCase';

@Module({
  controllers: [],
  providers: [FetchPlayersAndStatsUseCase],
})
export class DataModule {}
