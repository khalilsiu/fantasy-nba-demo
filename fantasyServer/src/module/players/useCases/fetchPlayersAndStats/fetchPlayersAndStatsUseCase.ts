import { Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { OracleService } from 'src/module/oracle/OracleService';
import { Cron } from '@nestjs/schedule';
import { PlayerData, PlayerStatsData } from '../../player.mapper';
import { Player } from '../../domain/player';
import { PlayerStats } from '../../domain/playerStats';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;
const years = [2021];
const teamIds = [1];
@Injectable()
export class FetchPlayersAndStatsUseCase {
  private readonly logger = new Logger(FetchPlayersAndStatsUseCase.name);

  @Cron('10 * * * * *')
  public async exec(): Promise<Response> {
    try {
      this.logger.log(`FetchPlayersAndStatsUseCase`);

      const fetchTeamsPromises: Promise<PlayerData[]>[] = [];

      teamIds.forEach((teamId) =>
        fetchTeamsPromises.push(OracleService.fetchTeam(teamId, years[0])),
      );

      const teams = await Promise.all(fetchTeamsPromises);

      // console.log(teams);

      const teamsOrErrorPromise: Promise<Result<Player>>[] = [];

      teams.forEach((players) =>
        players.forEach((player) => Player.create(player)),
      );

      const teamsOrError = await Promise.all(teamsOrErrorPromise);

      for (const teamOrError of teamsOrError) {
        if (teamOrError.isFailure) {
          throw teamOrError.error;
        }
      }

      const fetchPlayersPromises: Promise<PlayerStatsData[]>[] = [];

      teams.forEach((players) => {
        players.forEach((player) => {
          years.forEach((year) =>
            fetchPlayersPromises.push(
              OracleService.fetchPlayerStats(player.id, year),
            ),
          );
        });
      });

      const playersStats = await Promise.all(fetchPlayersPromises);

      console.log(playersStats);

      const playersStatsOrError: Promise<Result<PlayerStats>>[] = [];

      playersStats.forEach((playerStats) =>
        playerStats.forEach((stats) =>
          playersStatsOrError.push(PlayerStats.create(stats)),
        ),
      );

      for (const playersStatsOrError of teamsOrError) {
        if (playersStatsOrError.isFailure) {
          throw playersStatsOrError.error;
        }
      }

      return right(Result.ok<any>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
