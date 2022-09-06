import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';
import PlayerMapper, {
  PlayerData,
  GameLogData,
} from '../players/player.mapper';

export const ORACLE_SERVICE = 'ORACLE SERVICE';
const uri = process.env.MOCK_ORACLE_URL + '/data';

@Injectable()
export class OracleService {
  private static logger = new Logger(OracleService.name);
  public static async fetchgameLog(
    id: number,
    season: number,
  ): Promise<GameLogData[]> {
    const fetchAssetUri = `${uri}/player-statistics?id=${id}&season=${season}`;
    this.logger.log(`fetchgameLog ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri);
    const gameLogResponse = await res.json();
    const { response } = gameLogResponse;
    if (!res.ok || !response) {
      this.logger.log(`fetchgameLog response not ok`);
      throw new Error(res.statusText + fetchAssetUri);
    }
    this.logger.log(`fetchgameLog success`);
    return response.map(PlayerMapper.mapGameLogFromOracle);
  }
  public static async fetchTeam(
    team: number,
    season: number,
  ): Promise<PlayerData[]> {
    const fetchAssetUri = `${uri}/players?team=${team}&season=${season}`;
    this.logger.log(`fetchTeam ${fetchAssetUri}`);
    const res = await fetch(fetchAssetUri);
    const playerResponse = await res.json();
    const { response } = playerResponse;
    if (!res.ok || !response) {
      this.logger.log(`fetchTeam response not ok`);
      throw new Error(res.statusText);
    }
    this.logger.log(`fetchTeam success`);
    return response.map(PlayerMapper.mapPlayerFromOracle);
  }
}
