import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { OracleService } from 'src/module/oracle/OracleService';
import { Cron } from '@nestjs/schedule';
import { PlayerData, GameLogData } from '../../player.mapper';
import { Player } from '../../domain/player';
import { GameLog } from '../../domain/gameLog';
import { PLAYER_REPO, PlayerRepo } from '../../repos/player.repo';
import { GAME_LOG_REPO, GameLogRepo } from '../../repos/gameLog.repo';
import { throttlePromises } from 'src/shared/utils';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;
const years = [2021];
const teamIds = [1];
@Injectable()
export class FetchPlayersAndGameLogsUseCase {
  private readonly logger = new Logger(FetchPlayersAndGameLogsUseCase.name);

  constructor(
    @Inject(PLAYER_REPO) private playerRepo: PlayerRepo,
    @Inject(GAME_LOG_REPO) private gameLogRepo: GameLogRepo,
  ) {}

  @Cron('10 * * * * *')
  public async exec(): Promise<Response> {
    try {
      this.logger.log(`FetchPlayersAndGameLogsUseCase`);

      const fetchTeamsPromises: Promise<PlayerData[]>[] = [];
      teamIds.forEach((teamId) =>
        fetchTeamsPromises.push(OracleService.fetchTeam(teamId, years[0])),
      );
      const teams = await Promise.all(fetchTeamsPromises);
      this.logger.log(`fetched teams length ${teams.length}`);
      const playerDomainObjects: Player[] = [];
      for (const players of teams) {
        for (const player of players) {
          const teamOrError = await Player.create(player);
          if (teamOrError.isFailure) {
            throw teamOrError.error;
          }
          playerDomainObjects.push(teamOrError.getValue());
        }
      }

      this.logger.log(`before saving players`);
      await this.playerRepo.bulkUpsertPlayers(playerDomainObjects);
      this.logger.log(`after saving players`);

      const fetchPlayersPromises: Promise<GameLogData[]>[] = [];
      teams.forEach((players) => {
        players.forEach((player) => {
          years.forEach((year) =>
            fetchPlayersPromises.push(
              OracleService.fetchgameLog(player.playerId, year),
            ),
          );
        });
      });

      const playersStats = await throttlePromises(fetchPlayersPromises);
      this.logger.log(`fetched playersStats length ${playersStats.length}`);

      const gameLogDomainObjects: GameLog[] = [];
      for (const gameLog of playersStats) {
        for (const stats of gameLog) {
          const statsOrError = await gameLog.create(stats);
          if (statsOrError.isFailure) {
            throw statsOrError.error;
          }
          gameLogDomainObjects.push(statsOrError.getValue());
        }
      }
      this.logger.log(`before saving gameLog`);
      await this.gameLogRepo.bulkUpsertGameLog(gameLogDomainObjects);
      this.logger.log(`before saving gameLog`);

      return right(Result.ok<any>());
    } catch (err) {
      console.log(err);
      return left(new UnexpectedError(err));
    }
  }
}
