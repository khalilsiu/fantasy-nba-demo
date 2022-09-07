import { Game } from '../domain/game';

export const GAME_REPO = 'GAME REPO';

export interface GameRepo {
  bulkUpsertGame(games: Game[]): Promise<void>;
  getGameByGameId(gameId: number): Promise<Game | null>;
}
