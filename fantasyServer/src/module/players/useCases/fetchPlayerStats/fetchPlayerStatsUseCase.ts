import { Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import fetch from 'cross-fetch';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

const RAPID_API_URL = process.env.RAPID_API_URL;
const RAPID_API_KEY = process.env.RAPID_API_KEY;

@Injectable()
export class FetchPlayerStatsUseCase {
  private readonly logger = new Logger(FetchPlayerStatsUseCase.name);
  public async exec(id: number, season: number): Promise<Response> {
    try {
      this.logger.log(`FetchPlayerStatsUseCase`);

      const res = await fetch(
        `${RAPID_API_URL}/players/statistics?id=${id}&season=${season}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
          },
        },
      );

      const data = await res.json();

      return right(Result.ok<any>(data));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
