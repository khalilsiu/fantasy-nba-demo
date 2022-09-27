import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { League } from './domain/league';
import { Team } from './domain/team';
import { LeagueController } from './league.controller';
import { MongoLeagueRepo } from './repos/implementations/mongo/league.mongorepo';
import { LeagueSchema } from './repos/implementations/mongo/schemas/league.schema';
import { TeamSchema } from './repos/implementations/mongo/schemas/team.schema';
import { MongoTeamRepo } from './repos/implementations/mongo/team.mongorepo';
import { LEAGUE_REPO } from './repos/league.repo';
import { TEAM_REPO } from './repos/team.repo';
import { GetLeaguesUseCase } from './useCases/getLeagues/getLeaguesUseCase';
import { JoinLeagueUseCase } from './useCases/joinLeague/joinLeagueUseCase';
import { UpsertLeaguesUseCase } from './useCases/upsertLeagues/upsertLeaguesUseCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: League.name, schema: LeagueSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
  ],
  controllers: [LeagueController],
  providers: [
    UpsertLeaguesUseCase,
    JoinLeagueUseCase,
    GetLeaguesUseCase,
    {
      provide: LEAGUE_REPO,
      useClass: MongoLeagueRepo,
    },
    {
      provide: TEAM_REPO,
      useClass: MongoTeamRepo,
    },
  ],
})
export class LeagueModule {}
