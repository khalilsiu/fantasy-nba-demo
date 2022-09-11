import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
  NotFoundError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { League } from '../../domain/league';
import { LEAGUE_REPO, LeagueRepo } from '../../repos/league.repo';
import JoinLeagueDTO from './joinLeagueDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError | NotFoundError,
  Result<void>
>;

@Injectable()
export class JoinLeagueUseCase {
  private readonly logger = new Logger(JoinLeagueUseCase.name);

  constructor(@Inject(LEAGUE_REPO) private leagueRepo: LeagueRepo) {}

  public async exec(dto: JoinLeagueDTO): Promise<Response> {
    try {
      this.logger.log(`joinLeagueUseCase`);

      const league = await this.leagueRepo.findLeagueById(dto.leagueId);

      if (!league) {
        throw new NotFoundError(`leagueId ${league._id} is not Found`);
      }

      return right(Result.ok<any>());
    } catch (err) {
      console.log(err);
      return left(new UnexpectedError(err));
    }
  }
}
