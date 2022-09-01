import { Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import fetch from 'cross-fetch';
import { OracleService } from 'src/module/oracle/OracleService';
import { Cron } from '@nestjs/schedule';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;
const years = [2021]
const teamIds = [1]
@Injectable()
export class FetchPlayersAndStatsUseCase {
  private readonly logger = new Logger(FetchPlayersAndStatsUseCase.name);
  constructor() {
  }
  @Cron('10 * * * * *')
  public async exec(): Promise<Response> {
    try {
      this.logger.log(`FetchPlayersAndStatsUseCase`);

      const fetchTeamsPromises = []

      teamIds.forEach(teamId => years.forEach(year => {
        fetchTeamsPromises.push(OracleService.fetchTeam(teamId, year))
      }))

      const teams = await Promise.all(fetchTeamsPromises)

      console.log(teams);


      return right(Result.ok<any>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
