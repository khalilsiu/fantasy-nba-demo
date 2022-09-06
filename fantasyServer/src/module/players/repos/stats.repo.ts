import { Stats } from '../domain/stats';

export const STATS_REPO = 'STATS REPO';

export interface StatsRepo {
  bulkUpsertStats(stats: Stats[]): Promise<void>;
}
