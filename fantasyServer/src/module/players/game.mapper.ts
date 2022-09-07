import { DomainModelCreationError } from 'src/shared/core/AppError';
import { Game } from './domain/game';

export interface TeamData {
  id: number;
  name: string;
  code: string;
}

export interface ScoreData {
  win: number;
  loss: number;
  series: {
    win: number;
    loss: number;
  };
  linescore: string[];
  points: number;
}

export interface ArenaData {
  name: string;
  city: string;
  state: string;
}

export interface StatusData {
  clock?: string;
  halftime: boolean;
  short: number;
  long: string;
}

export interface PeriodData {
  current: number;
  total: number;
  endOfPeriod: boolean;
}

export interface GameDateData {
  start: string;
  end: string;
  duration: string;
}

export interface GameData {
  gameId: number;
  season: number;
  date: GameDateData;
  status: StatusData;
  periods: PeriodData;
  arena: ArenaData;
  teams: {
    visitors: TeamData;
    home: TeamData;
  };
  scores: {
    visitors: ScoreData;
    home: ScoreData;
  };
}

export class GameMapper {
  static async mapGameToDomain({
    gameId,
    season,
    date,
    status,
    periods,
    arena,
    teams,
    scores,
  }) {
    const gameOrError = await Game.create({
      gameId,
      season,
      date,
      status,
      periods,
      arena,
      teams,
      scores,
    });
    if (gameOrError.isFailure) {
      throw new DomainModelCreationError(gameOrError.error.toString());
    }
    return gameOrError.getValue();
  }

  static mapGameFromOracle({
    id,
    season,
    date,
    status,
    periods,
    arena,
    teams,
    scores,
  }): GameData {
    const { name, city, state } = arena;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      visitors: { nickname: vNickname, ...visitorRest },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      home: { nickname: hNickname, ...homeRest },
    } = teams;
    return {
      gameId: id,
      season,
      date,
      status,
      periods,
      arena: {
        name,
        city,
        state,
      },
      teams: {
        visitors: visitorRest,
        home: homeRest,
      },
      scores,
    };
  }
}
