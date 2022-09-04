import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';
import PlayerMapper, {
  PlayerData,
  PlayerStatsData,
} from '../players/player.mapper';

export const ORACLE_SERVICE = 'ORACLE SERVICE';
const uri = process.env.MOCK_ORACLE_URL + '/data';

@Injectable()
export class OracleService {
  private static logger = new Logger(OracleService.name);
  public static async fetchPlayerStats(
    id: number,
    season: number,
  ): Promise<PlayerStatsData[]> {
    this.logger.log(
      `OracleService fetchPlayerStats, id: ${id}, season: ${season}`,
    );
    const fetchAssetUri = `${uri}/player-statistics`;
    this.logger.log(`OracleService fetchPlayerStats ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri + `?id=${id}&season=${season}`);
    const playerStatsResponse = await res.json();
    const { response } = playerStatsResponse;
    if (!res.ok || !response) {
      throw new Error('Fetch team error from oracle');
    }
    this.logger.log(`OracleService fetchPlayerStats success`);
    return response.map(PlayerMapper.mapPlayerStatsFromOracle);
  }
  public static async fetchTeam(
    team: number,
    season: number,
  ): Promise<PlayerData[]> {
    this.logger.log(
      `OracleService fetchTeam, team: ${team}, season: ${season}`,
    );
    const fetchAssetUri = `${uri}/players`;
    this.logger.log(`OracleService fetchTeam ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri + `?team=${team}&season=${season}`);
    const playerResponse = await res.json();
    const { response } = playerResponse;
    if (!res.ok || !response) {
      throw new Error('Fetch team error from oracle');
    }
    this.logger.log(`OracleService fetchTeam success`);
    return response.map(PlayerMapper.mapPlayerFromOracle);
  }
}
