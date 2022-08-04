import { Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import fetch from 'cross-fetch';
import { Cron } from '@nestjs/schedule';
import { OracleService } from 'src/module/oracle/OracleService';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

const teamIdToName = {
  '1': 'Utah Jazz',
  '2': 'Boston Celtics'
}

const currentYear = (new Date()).getFullYear();
const teams = Array(2).fill((_, i) => i+1)
@Injectable()
export class FetchPlayerStatsUseCase {
  private readonly logger = new Logger(FetchPlayerStatsUseCase.name);
  private years: number[]
  constructor() {
    this.years = Array(1).fill(null).map((_,i) => currentYear-i);
  }

  @Cron('45 * * * * *')
  public async exec(): Promise<Response> {
    try {
      this.logger.log(`FetchPlayerStatsUseCase`);

      const teamPromiseArray = this.years.reduce(((acc, year) => {
        const teamsRequest = teams.map(team=> OracleService.fetchTeam(team, year))
        acc.push(...teamsRequest);
        return acc;
      }), [])


      const teams = (await Promise.all(teamPromiseArray)).;

      const playerStatsPromiseArray = teams.forEach((team => {
        if (team.parameters && team.parameters.season !== currentYear.toString()) {
          return;
        }

      }))

      return right(Result.ok<any>(res));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
