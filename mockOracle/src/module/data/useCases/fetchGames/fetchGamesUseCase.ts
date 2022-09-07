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
export class FetchGamesUseCase {
  private readonly logger = new Logger(FetchGamesUseCase.name);
  public async exec(id?: number, date?: string): Promise<Response> {
    try {
      this.logger.log(`FetchGameUseCase`);
      let query = `id=${id}`;
      if (!id && date) {
        query = `date=${date}`;
      }

      const res = await fetch(`${RAPID_API_URL}/games?${query}`, {
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
        },
      });

      const data = await res.json();

      return right(Result.ok<any>(data));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
