import { GameLog } from '../domain/gameLog';

export const GAME_LOG_REPO = 'GAME LOG REPO';

export interface GameLogRepo {
  bulkUpsertGameLog(gameLogs: GameLog[]): Promise<void>;
  // getGameLogsByPlayerId(playerId: number): Promise<GameLog[]>;
}
