import { Player } from '../domain/Player';

export const PLAYER_REPO = 'PLAYER REPO';

export interface PlayerRepo {
  bulkUpsertPlayers(players: Player[]): Promise<void>;
  getPlayerIds(): Promise<number[]>;
}
