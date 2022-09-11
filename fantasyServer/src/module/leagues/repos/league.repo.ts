import { League } from '../domain/league';

export const LEAGUE_REPO = 'LEAGUE REPO';

export interface LeagueRepo {
  bulkUpsertLeague(leagues: League[]): Promise<void>;
  findLeagueById(leagueId: string): Promise<League>;
}
