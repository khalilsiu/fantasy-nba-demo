import { Logger } from '@nestjs/common';
import { DclStats } from './domain/dclStats';
export class StatsMapper {
  static readonly logger = new Logger(StatsMapper.name);

  static processDclStatsFromSource(dclStats: any): DclStats[] {
    return Object.keys(dclStats).reduce((previous, key) => {
      const landData = dclStats[key];
      const current = {
        id: previous.length + 1,
        coordinates: key,
        ytdUsers: Number(
          (landData['yesterday'] && landData['yesterday']['users']) ?? 0,
        ),
        ytdSessions: Number(
          (landData['yesterday'] && landData['yesterday']['sessions']) ?? 0,
        ),
        ytdMedianSessionTime: Number(
          (landData['yesterday'] &&
            landData['yesterday']['median_session_time']) ??
            0,
        ),
        ytdMaxConcurrentUsers: Number(
          (landData['yesterday'] &&
            landData['yesterday']['max_concurrent_users']) ??
            0,
        ),
        weeklyUsers: Number(
          (landData['last_7d'] && landData['last_7d']['users']) ?? 0,
        ),
        weeklySessions: Number(
          (landData['last_7d'] && landData['last_7d']['sessions']) ?? 0,
        ),
        weeklyMedianSessionTime: Number(
          (landData['last_7d'] && landData['last_7d']['median_session_time']) ??
            0,
        ),
        weeklyMaxConcurrentUsers: Number(
          (landData['last_7d'] &&
            landData['last_7d']['max_concurrent_users']) ??
            0,
        ),
        monthlyUsers: Number(
          (landData['last_30d'] && landData['last_30d']['users']) ?? 0,
        ),
        monthlySessions: Number(
          (landData['last_30d'] && landData['last_30d']['sessions']) ?? 0,
        ),
        monthlyMedianSessionTime: Number(
          (landData['last_30d'] &&
            landData['last_30d']['median_session_time']) ??
            0,
        ),
        monthlyMaxConcurrentUsers: Number(
          (landData['last_30d'] &&
            landData['last_30d']['max_concurrent_users']) ??
            0,
        ),
      };
      previous.push(current);
      return previous;
    }, [] as DclStats[]);
  }
}
