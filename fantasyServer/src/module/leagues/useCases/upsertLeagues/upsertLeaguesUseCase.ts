import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { League } from '../../domain/league';
import { LEAGUE_REPO, LeagueRepo } from '../../repos/league.repo';
import UpsertLeaguesDTO from './upsertLeaguesDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

@Injectable()
export class UpsertLeaguesUseCase {
  private readonly logger = new Logger(UpsertLeaguesUseCase.name);

  constructor(@Inject(LEAGUE_REPO) private leagueRepo: LeagueRepo) {}

  public async exec({ leagues }: UpsertLeaguesDTO): Promise<Response> {
    try {
      this.logger.log(`UpsertLeaguesUseCase`);
      const leagueDomainObjects: League[] = [];

      for (const leagueProps of leagues) {
        const { draftDateTime } = leagueProps;

        const leagueOrError = await League.create({
          ...leagueProps,
          draftDateTime: new Date(draftDateTime),
        });
        if (leagueOrError.isFailure) {
          return left(
            new DomainModelCreationError(leagueOrError.error.toString()),
          );
        }
        leagueDomainObjects.push(leagueOrError.getValue());
      }

      await this.leagueRepo.bulkUpsertLeague(leagueDomainObjects);

      return right(Result.ok<any>());
    } catch (err) {
      console.log(err);
      return left(new UnexpectedError(err));
    }
  }
}
