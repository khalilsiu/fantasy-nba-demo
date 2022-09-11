import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { League } from './domain/league';
import { LeagueController } from './league.controller';
import { MongoLeagueRepo } from './repos/implementations/mongo/league.mongorepo';
import { LeagueSchema } from './repos/implementations/mongo/schemas/league.schema';
import { LEAGUE_REPO } from './repos/league.repo';
import { JoinLeagueUseCase } from './useCases/joinLeague/joinLeagueUseCase';
import { UpsertLeaguesUseCase } from './useCases/upsertLeagues/upsertLeaguesUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: League.name, schema: LeagueSchema }]),
  ],
  controllers: [LeagueController],
  providers: [
    UpsertLeaguesUseCase,
    JoinLeagueUseCase,
    {
      provide: LEAGUE_REPO,
      useClass: MongoLeagueRepo,
    },
  ],
})
export class LeagueModule {}
