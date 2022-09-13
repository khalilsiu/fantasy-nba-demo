import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
  NotFoundError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Team } from '../../domain/team';
import { LEAGUE_REPO, LeagueRepo } from '../../repos/league.repo';
import { TeamRepo, TEAM_REPO } from '../../repos/team.repo';
import JoinLeagueDTO from './joinLeagueDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError | NotFoundError,
  Result<void>
>;

@Injectable()
export class JoinLeagueUseCase {
  private readonly logger = new Logger(JoinLeagueUseCase.name);

  constructor(
    @Inject(LEAGUE_REPO) private leagueRepo: LeagueRepo,
    @Inject(TEAM_REPO) private teamRepo: TeamRepo,
  ) {}

  public async exec({
    leagueId,
    walletAddress,
    name,
  }: JoinLeagueDTO): Promise<Response> {
    try {
      this.logger.log(`joinLeagueUseCase`);

      const league = await this.leagueRepo.findLeagueById(leagueId);

      if (!league) {
        return left(new NotFoundError(`leagueId ${league._id} is not Found`));
      }

      if (league.maxTeams === league.teamIds.length) {
        return left(new DomainModelCreationError('Max team reached.'));
      }

      const teamOrError = await Team.create({
        leagueId,
        walletAddress,
        name,
        waiverRank: league.teamIds.length + 1,
        createdAt: new Date(),
      });

      if (teamOrError.isFailure) {
        return left(new DomainModelCreationError(teamOrError.error.toString()));
      }

      await this.teamRepo.bulkUpsertTeam([teamOrError.getValue()]);

      return right(Result.ok<any>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
