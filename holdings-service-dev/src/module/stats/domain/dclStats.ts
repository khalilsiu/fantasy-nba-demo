export interface DclStats {
  coordinates: string;
  ytdUsers: number;
  ytdSessions: number;
  ytdMedianSessionTime: number;
  ytdMaxConcurrentUsers: number;
  weeklyUsers: number;
  weeklySessions: number;
  weeklyMedianSessionTime: number;
  weeklyMaxConcurrentUsers: number;
  monthlyUsers: number;
  monthlySessions: number;
  monthlyMedianSessionTime: number;
  monthlyMaxConcurrentUsers: number;
}

export enum METAVERSE {
  DECENTRALAND = 'decentraland',
  CRYPTOVOXEL = 'cryptovoxel',
  SOMNIUM_SPACE = 'somnium-space',
  SANDBOX = 'sandbox',
}
