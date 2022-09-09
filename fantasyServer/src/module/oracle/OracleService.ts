import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';
import { GameData, GameMapper } from '../players/game.mapper';
import { GameLogData, GameLogMapper } from '../players/gameLog.mapper';
import PlayerMapper, { PlayerData } from '../players/player.mapper';

export const ORACLE_SERVICE = 'ORACLE SERVICE';
const uri = process.env.MOCK_ORACLE_URL + '/data';

@Injectable()
export class OracleService {
  private static logger = new Logger(OracleService.name);
  public static async fetchGameLog(
    id: number,
    season: number,
  ): Promise<GameLogData[]> {
    const endpoint = `${uri}/player-statistics?id=${id}&season=${season}`;
    this.logger.log(`fetchGameLog ${endpoint}`);
    const res = await fetch(endpoint);
    const gameLogResponse = await res.json();
    const { response } = gameLogResponse;
    if (!res.ok || !response) {
      this.logger.log(`fetchGameLog response not ok endpoint: ${endpoint}`);
      throw new Error(res.statusText + endpoint);
    }
    this.logger.log(`fetchGameLog success`);
    return response.map(GameLogMapper.mapGameLogFromOracle);
  }
  public static async fetchTeam(
    team: number,
    season: number,
  ): Promise<PlayerData[]> {
    const endpoint = `${uri}/players?team=${team}&season=${season}`;
    this.logger.log(`fetchTeam ${endpoint}`);
    const res = await fetch(endpoint);
    const playerResponse = await res.json();
    const { response } = playerResponse;
    if (!res.ok || !response) {
      this.logger.log(`fetchTeam response not ok endpoint: ${endpoint}`);
      throw new Error(res.statusText);
    }
    this.logger.log(`fetchTeam success`);
    return response.map(PlayerMapper.mapPlayerFromOracle);
  }

  public static async fetchGameById(gameId: number): Promise<GameData> {
    const endpoint = `${uri}/games?id=${gameId}`;
    this.logger.log(`fetchGameById ${endpoint}`);
    const res = await fetch(endpoint);
    const gameResponse = await res.json();
    const { response } = gameResponse;
    console.log({ ok: res.ok });
    if (!response) {
      this.logger.log(`fetchGameById response not ok endpoint: ${endpoint}`);
      throw new Error(res.statusText);
    }
    if (!response.length) {
      this.logger.log(`fetchGameById game not found`);
      throw new Error('fetchGameById game not found');
    }
    this.logger.log(`fetchGameById success`);
    return GameMapper.mapGameFromOracle(response[0]);
  }
}
