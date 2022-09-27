import { League } from '../domain/league';
import { GetLeaguesSortableFields } from '../useCases/getLeagues/getLeaguesDTO';

export const LEAGUE_REPO = 'LEAGUE REPO';

export interface FindLeaguesFields {
  commissionerWalletAddress?: string;
  drafted?: boolean;
  showDeleted?: boolean;
  isPrivate?: boolean;
}

export interface FindOptions {
  sortBy: GetLeaguesSortableFields;
  order: 1 | -1;
  offset: number;
  limit: number;
}

export interface LeagueRepo {
  bulkUpsertLeague(leagues: League[]): Promise<void>;
  findLeagueById(leagueId: string): Promise<League | null>;
  find(fields: FindLeaguesFields, options?: FindOptions): Promise<League[]>;
  count(fields: FindLeaguesFields): Promise<number>;
}
