import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Cron } from '@nestjs/schedule';
import { GAME_LOG_REPO, GameLogRepo } from '../../repos/gameLog.repo';
import { PlayerRepo, PLAYER_REPO } from '../../repos/player.repo';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

@Injectable()
export class AggregateStatsUseCase {
  private readonly logger = new Logger(AggregateStatsUseCase.name);

  constructor(
    @Inject(PLAYER_REPO) private playerRepo: PlayerRepo,
    @Inject(GAME_LOG_REPO) private gameLogRepo: GameLogRepo,
  ) {}

  // @Cron('10 * * * * *')
  public async exec(): Promise<Response> {
    try {
      this.logger.log(`AggregateStatsUseCase`);

      const playerIds = await this.playerRepo.getPlayerIds();

      for (const playerId of playerIds) {
        // const gameLogs = await this.gameLogRepo.getGameLogsByPlayerId(playerId);
      }

      return right(Result.ok<any>());
    } catch (err) {
      console.log(err);
      return left(new UnexpectedError(err));
    }
  }
}
