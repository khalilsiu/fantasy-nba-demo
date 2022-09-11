import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { OracleService } from 'src/module/oracle/OracleService';
import { Player } from '../../domain/player';
import { GameLog } from '../../domain/gameLog';
import { PLAYER_REPO, PlayerRepo } from '../../repos/player.repo';
import { GAME_LOG_REPO, GameLogRepo } from '../../repos/gameLog.repo';
import { throttlePromises } from 'src/shared/utils';
import { Game } from '../../domain/game';
import { GameRepo, GAME_REPO } from '../../repos/game.repo';
import { PlayerData } from '../../mappers/player.mapper';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;
const years = [2021, 2020];
const teamIds = [1, 2];
@Injectable()
export class FetchPlayersAndGameLogsUseCase {
  private readonly logger = new Logger(FetchPlayersAndGameLogsUseCase.name);

  constructor(
    @Inject(PLAYER_REPO) private playerRepo: PlayerRepo,
    @Inject(GAME_LOG_REPO) private gameLogRepo: GameLogRepo,
    @Inject(GAME_REPO) private gameRepo: GameRepo,
  ) {
    // this.exec();
  }

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
            throw new DomainModelCreationError(teamOrError.error.toString());
          }
          playerDomainObjects.push(teamOrError.getValue());
        }
      }
      this.logger.log(`before saving players`);
      await this.playerRepo.bulkUpsertPlayers(playerDomainObjects);
      this.logger.log(`after saving players`);

      let gameLogPromises = [];
      const gameLogDomainObjects: GameLog[] = [];
      for (const year of years) {
        for (const players of teams) {
          for (let i = 0; i < players.length; i++) {
            const { result: playersGameLogs, outputPromises: promises } =
              await throttlePromises(
                OracleService.fetchGameLog(players[i].playerId, year),
                i,
                players.length,
                gameLogPromises,
              );
            if (playersGameLogs.length) {
              const tempGameLogDomainObjects: GameLog[] = [];
              for (const gameLogs of playersGameLogs) {
                for (const gameLog of gameLogs) {
                  const gameLogOrError = await GameLog.create(gameLog);
                  if (gameLogOrError.isFailure) {
                    throw new DomainModelCreationError(
                      gameLogOrError.error.toString(),
                    );
                  }
                  tempGameLogDomainObjects.push(gameLogOrError.getValue());
                  gameLogDomainObjects.push(gameLogOrError.getValue());
                }
              }
              this.logger.log(`before saving gameLogs`);
              await this.gameLogRepo.bulkUpsertGameLog(gameLogDomainObjects);
              this.logger.log(`after saving gameLogs`);
            }
            gameLogPromises = promises;
          }
        }
      }

      let gamePromises = [];

      for (let i = 0; i < gameLogDomainObjects.length; i++) {
        const game = await this.gameRepo.findGameByGameId(
          gameLogDomainObjects[i].gameId,
        );
        if (game) {
          this.logger.log(`gameId ${game.gameId} exists`);
          continue;
        }
        const { result, outputPromises } = await throttlePromises(
          OracleService.fetchGameById(gameLogDomainObjects[i].gameId),
          i,
          gameLogDomainObjects.length,
          gamePromises,
        );
        if (result.length) {
          const tempGameDomainObjects = [];
          for (const game of result) {
            const gameOrError = await Game.create(game);
            if (gameOrError.isFailure) {
              throw new DomainModelCreationError(gameOrError.error.toString());
            }
            tempGameDomainObjects.push(gameOrError.getValue());
          }
          this.logger.log(`before saving game`);
          await this.gameRepo.bulkUpsertGame(tempGameDomainObjects);
          this.logger.log(`after saving game`);
        }
        gamePromises = outputPromises;
      }

      return right(Result.ok<any>());
    } catch (err) {
      console.log(err);
      return left(new UnexpectedError(err));
    }
  }
}
