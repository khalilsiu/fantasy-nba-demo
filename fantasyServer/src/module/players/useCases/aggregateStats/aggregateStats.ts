import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { GAME_LOG_REPO, GameLogRepo } from '../../repos/gameLog.repo';
import { PlayerRepo, PLAYER_REPO } from '../../repos/player.repo';
import { GAME_REPO, GameRepo } from '../../repos/game.repo';
import { GameLog } from '../../domain/gameLog';
import { subDays } from 'date-fns';
import { Stats } from '../../domain/stats';
import { SEASON_START_2021, SEASON_START_2020 } from 'src/shared/constants';
import { STATS_REPO, StatsRepo } from '../../repos/stats.repo';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

export type GameLogWithDate = GameLog & { date: Date };

@Injectable()
export class AggregateStatsUseCase {
  private readonly logger = new Logger(AggregateStatsUseCase.name);
  private sevenDaysAgo: Date;
  private forteenDaysAgo: Date;
  private thirtyDaysAgo: Date;
  private thisSeasonStarts: Date;
  private lastSeasonStarts: Date;

  constructor(
    @Inject(PLAYER_REPO) private playerRepo: PlayerRepo,
    @Inject(GAME_LOG_REPO) private gameLogRepo: GameLogRepo,
    @Inject(GAME_REPO) private gameRepo: GameRepo,
    @Inject(STATS_REPO) private statsRepo: StatsRepo,
  ) {
    this.sevenDaysAgo = subDays(new Date(), 7);
    this.forteenDaysAgo = subDays(new Date(), 14);
    this.thirtyDaysAgo = subDays(new Date(), 30);
    this.thisSeasonStarts = new Date(SEASON_START_2021);
    this.lastSeasonStarts = new Date(SEASON_START_2020);
    // this.exec();
  }

  private aggregateStats(stats: GameLogWithDate[], mode: 'total' | 'average') {
    const totalStats = {
      points: 0,
      fgm: 0,
      fga: 0,
      fgp: 0,
      ftm: 0,
      fta: 0,
      ftp: 0,
      tpm: 0,
      tpa: 0,
      tpp: 0,
      offReb: 0,
      defReb: 0,
      totReb: 0,
      assists: 0,
      pFouls: 0,
      steals: 0,
      turnovers: 0,
      blocks: 0,
    };
    stats.forEach((stat) => {
      totalStats.points += stat.points;
      totalStats.fgm += stat.fgm;
      totalStats.fga += stat.fga;
      totalStats.fgp += parseFloat(stat.fgp);
      totalStats.ftm += stat.ftm;
      totalStats.fta += stat.fta;
      totalStats.ftp += parseFloat(stat.ftp);
      totalStats.tpm += stat.tpm;
      totalStats.tpa += stat.tpa;
      totalStats.tpp += parseFloat(stat.tpp);
      totalStats.offReb += stat.offReb;
      totalStats.defReb += stat.defReb;
      totalStats.totReb += stat.totReb;
      totalStats.assists += stat.assists;
      totalStats.pFouls += stat.pFouls;
      totalStats.steals += stat.steals;
      totalStats.turnovers += stat.turnovers;
      totalStats.blocks += stat.blocks;
    });
    if (mode === 'total') {
      return totalStats;
    }
    return {
      points: parseFloat((totalStats.points / stats.length).toFixed(2)),
      fgm: parseFloat((totalStats.fgm / stats.length).toFixed(2)),
      fga: parseFloat((totalStats.fga / stats.length).toFixed(2)),
      fgp: parseFloat((totalStats.fgp / stats.length).toFixed(2)),
      ftm: parseFloat((totalStats.ftm / stats.length).toFixed(2)),
      fta: parseFloat((totalStats.fta / stats.length).toFixed(2)),
      ftp: parseFloat((totalStats.ftp / stats.length).toFixed(2)),
      tpm: parseFloat((totalStats.tpm / stats.length).toFixed(2)),
      tpa: parseFloat((totalStats.tpa / stats.length).toFixed(2)),
      tpp: parseFloat((totalStats.tpp / stats.length).toFixed(2)),
      offReb: parseFloat((totalStats.offReb / stats.length).toFixed(2)),
      defReb: parseFloat((totalStats.defReb / stats.length).toFixed(2)),
      totReb: parseFloat((totalStats.totReb / stats.length).toFixed(2)),
      assists: parseFloat((totalStats.assists / stats.length).toFixed(2)),
      pFouls: parseFloat((totalStats.pFouls / stats.length).toFixed(2)),
      steals: parseFloat((totalStats.steals / stats.length).toFixed(2)),
      turnovers: parseFloat((totalStats.turnovers / stats.length).toFixed(2)),
      blocks: parseFloat((totalStats.blocks / stats.length).toFixed(2)),
    };
  }

  public async exec(): Promise<Response> {
    try {
      this.logger.log(`AggregateStatsUseCase`);

      const playerIds = await this.playerRepo.getPlayerIds();
      let playerStats: Stats[] = [];

      for (let i = 0; i < playerIds.length; i++) {
        this.logger.log(`aggregate playerId ${playerIds[i]}`);
        const gameLogsWithDate: GameLogWithDate[] = [];
        const gameLogs = await this.gameLogRepo.getGameLogsByPlayerId(
          playerIds[i],
        );
        for (const gameLog of gameLogs) {
          const game = await this.gameRepo.findGameByGameId(gameLog.gameId);
          gameLogsWithDate.push({ ...gameLog, date: new Date(game.date.end) });
        }
        const last7DaysGameLogs = gameLogsWithDate.filter(
          (gameLog) =>
            gameLog.date > this.sevenDaysAgo && gameLog.points !== null,
        );
        this.logger.log(
          `aggregate last7DaysGameLogs length ${last7DaysGameLogs.length}`,
        );

        const last14DaysGameLogs = gameLogsWithDate.filter(
          (gameLog) =>
            gameLog.date > this.forteenDaysAgo && gameLog.points !== null,
        );
        this.logger.log(
          `aggregate last14DaysGameLogs length ${last14DaysGameLogs.length}`,
        );

        const last30DaysGameLogs = gameLogsWithDate.filter(
          (gameLog) =>
            gameLog.date > this.thirtyDaysAgo && gameLog.points !== null,
        );
        this.logger.log(
          `aggregate last30DaysGameLogs length ${last30DaysGameLogs.length}`,
        );

        const thisSeasonGameLogs = gameLogsWithDate.filter(
          (gameLog) =>
            gameLog.date > this.thisSeasonStarts && gameLog.points !== null,
        );
        this.logger.log(
          `aggregate thisSeasonGameLogs length ${thisSeasonGameLogs.length}`,
        );

        const lastSeasonGameLogs = gameLogsWithDate.filter(
          (gameLog) =>
            gameLog.date > this.lastSeasonStarts && gameLog.points !== null,
        );
        this.logger.log(
          `aggregate lastSeasonGameLogs length ${lastSeasonGameLogs.length}`,
        );

        const last7DaysAvg = this.aggregateStats(last7DaysGameLogs, 'average');
        const last7DaysTot = this.aggregateStats(last7DaysGameLogs, 'total');

        const last14DaysAvg = this.aggregateStats(
          last14DaysGameLogs,
          'average',
        );
        const last14DaysTot = this.aggregateStats(last14DaysGameLogs, 'total');

        const last30DaysAvg = this.aggregateStats(
          last30DaysGameLogs,
          'average',
        );
        const last30DaysTot = this.aggregateStats(last30DaysGameLogs, 'total');

        const thisSeasonAvg = this.aggregateStats(
          thisSeasonGameLogs,
          'average',
        );
        const thisSeasonTot = this.aggregateStats(thisSeasonGameLogs, 'total');

        const lastSeasonAvg = this.aggregateStats(
          lastSeasonGameLogs,
          'average',
        );
        const lastSeasonTot = this.aggregateStats(lastSeasonGameLogs, 'total');
        const statsOrError = await Stats.create({
          playerId: playerIds[i],
          last7DaysAvg,
          last7DaysTot,
          last14DaysAvg,
          last14DaysTot,
          last30DaysAvg,
          last30DaysTot,
          thisSeasonAvg,
          thisSeasonTot,
          lastSeasonAvg,
          lastSeasonTot,
        });
        if (statsOrError.isFailure) {
          return left(
            new DomainModelCreationError(statsOrError.error.toString()),
          );
        }
        playerStats.push(statsOrError.getValue());
        if (playerStats.length === 20 || i === playerIds.length - 1) {
          this.logger.log(`before saving stats`);
          await this.statsRepo.bulkUpsertStats(playerStats);
          this.logger.log(`after saving stats`);
          playerStats = [];
        }
      }

      return right(Result.ok<any>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
