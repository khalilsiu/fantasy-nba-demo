import { DomainModelCreationError } from 'src/shared/core/AppError';
import { GameLog } from './domain/gameLog';

export interface GameLogData {
  playerId: number;
  teamId: number;
  gameId: number;
  points?: number;
  pos?: string;
  min?: string;
  fgm?: number;
  fga?: number;
  fgp?: string;
  ftm?: number;
  fta?: number;
  ftp?: string;
  tpm?: number;
  tpa?: number;
  tpp?: string;
  offReb?: number;
  defReb?: number;
  totReb?: number;
  assists?: number;
  pFouls?: number;
  steals?: number;
  turnovers?: number;
  blocks?: number;
  plusMinus?: string;
  comment?: string;
}

export class GameLogMapper {
  static mapGameLogFromOracle({
    player,
    team,
    game,
    points,
    pos,
    min,
    fgm,
    fga,
    fgp,
    ftm,
    fta,
    ftp,
    tpm,
    tpa,
    tpp,
    offReb,
    defReb,
    totReb,
    assists,
    pFouls,
    steals,
    turnovers,
    blocks,
    plusMinus,
    comment,
  }): GameLogData {
    return {
      playerId: player.id,
      teamId: team.id,
      gameId: game.id,
      points,
      pos,
      min,
      fgm,
      fga,
      fgp,
      ftm,
      fta,
      ftp,
      tpm,
      tpa,
      tpp,
      offReb,
      defReb,
      totReb,
      assists,
      pFouls,
      steals,
      turnovers,
      blocks,
      plusMinus,
      comment,
    };
  }

  static async mapGameLogToDomain({
    playerId,
    teamId,
    gameId,
    points,
    pos,
    min,
    fgm,
    fga,
    fgp,
    ftm,
    fta,
    ftp,
    tpm,
    tpa,
    tpp,
    offReb,
    defReb,
    totReb,
    assists,
    pFouls,
    steals,
    turnovers,
    blocks,
    plusMinus,
    comment,
  }: GameLog & Document) {
    const gameLogOrError = await GameLog.create({
      playerId,
      teamId,
      gameId,
      points,
      pos,
      min,
      fgm,
      fga,
      fgp,
      ftm,
      fta,
      ftp,
      tpm,
      tpa,
      tpp,
      offReb,
      defReb,
      totReb,
      assists,
      pFouls,
      steals,
      turnovers,
      blocks,
      plusMinus,
      comment,
    });

    if (gameLogOrError.isFailure) {
      throw new DomainModelCreationError(gameLogOrError.error.toString());
    }
    return gameLogOrError.getValue();
  }
}
