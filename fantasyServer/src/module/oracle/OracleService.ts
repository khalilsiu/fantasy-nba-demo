import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';

export const ORACLE_SERVICE = 'ORACLE SERVICE';
const uri = process.env.MOCK_ORACLE_URL + '/data';

@Injectable()
export class OracleService {
  private static logger = new Logger(OracleService.name);
  public static async fetchPlayerStats(
    id: number,
    season: number,
  ): Promise<any> {
    this.logger.log(
      `OracleService fetchPlayerStats, id: ${id}, season: ${season}`,
    );
    const fetchAssetUri = `${uri}/player-statistics`;
    this.logger.log(`OracleService fetchPlayerStats ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri + `?id=${id}&season=${season}`);
    const playerStats = await res.json();
    this.logger.log(
      `OracleService fetchPlayerStats ${JSON.stringify(playerStats)}`,
    );
    return playerStats;
  }
  public static async fetchTeam(team: number, season: number): Promise<any> {
    this.logger.log(
      `OracleService fetchTeam, team: ${team}, season: ${season}`,
    );
    const fetchAssetUri = `${uri}/player`;
    this.logger.log(`OracleService fetchTeam ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri + `?team=${team}&season=${season}`);
    const player = await res.json();
    this.logger.log(`OracleService fetchTeam ${JSON.stringify(player)}`);
    return player;
  }
}
