import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
  NotFoundError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { League } from '../../domain/league';
import { LEAGUE_REPO, LeagueRepo } from '../../repos/league.repo';
import { TeamRepo, TEAM_REPO } from '../../repos/team.repo';
import GetLeaguesDTO from './getLeaguesDTO';

export interface GetLeaguesResponseDTO {
  leagues: League[];
  total: number;
}

type Response = Either<
  DomainModelCreationError | UnexpectedError | NotFoundError,
  Result<GetLeaguesResponseDTO>
>;

@Injectable()
export class GetLeaguesUseCase {
  private readonly logger = new Logger(GetLeaguesUseCase.name);

  constructor(
    @Inject(LEAGUE_REPO) private leagueRepo: LeagueRepo,
    @Inject(TEAM_REPO) private teamRepo: TeamRepo,
  ) {}

  public async exec({
    sortBy,
    order = 1,
    limit,
    offset,
    ...query
  }: GetLeaguesDTO): Promise<Response> {
    try {
      this.logger.log(`getLeaguesUseCase`);
      let leagues: League[];
      let total: number;
      console.log('query1', query);

      try {
        leagues = await this.leagueRepo.find(query, {
          sortBy,
          order,
          offset,
          limit,
        });
        total = await this.leagueRepo.count(query);
      } catch (err) {
        return left(new DomainModelCreationError(err.message));
      }
      return right(Result.ok<GetLeaguesResponseDTO>({ leagues, total }));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
