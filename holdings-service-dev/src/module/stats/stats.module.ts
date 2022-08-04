import { Module } from '@nestjs/common';
import { FetchFromSourceUseCase } from './useCases/fetchFromSource/fetchFromSourceUseCase';
import { StatsController } from './stats.controller';

@Module({
  imports: [],
  controllers: [StatsController],
  providers: [FetchFromSourceUseCase],
  exports: [FetchFromSourceUseCase],
})
export class StatsModule {}
