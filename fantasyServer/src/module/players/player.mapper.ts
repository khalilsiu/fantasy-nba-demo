export interface PlayerStatsData {
  playerId: number;
  team: {
    id: number;
    name: string;
    nickname: string;
    code: string;
    logo: string;
  };
  gameId: number;
  points?: number;
  pos?: string;
  min?: string;
  fgm?: number;
  fga?: number;
  fgp?: string;
  ftm?: number;
  fta?: number;
  ftp?: string;
  tpm?: number;
  tpa?: number;
  tpp?: string;
  offReb?: number;
  defReb?: number;
  totReb?: number;
  assists?: number;
  pFouls?: number;
  steals?: number;
  turnovers?: number;
  blocks?: number;
  plusMinus?: string;
  comment?: string;
}

export interface PlayerData {
  id: number;
  firstName: string;
  lastName: string;
  birth: {
    date?: string;
    country?: string;
  };
  nba: {
    start: number;
    pro: number;
  };
  height: {
    feets?: string;
    inches?: string;
    meters?: string;
  };
  weight: {
    pounds?: string;
    kilograms?: string;
  };
  college: string;
  affiliation: string;
  jersey?: number;
  active?: boolean;
  pos?: string;
}

export default class PlayerMapper {
  static mapPlayerFromOracle({
    id,
    firstname,
    lastname,
    birth,
    nba,
    height,
    weight,
    college,
    affiliation,
    leagues,
  }): PlayerData {
    const { standard } = leagues;
    return {
      id,
      firstName: firstname,
      lastName: lastname,
      birth,
      nba,
      height,
      weight,
      college,
      affiliation,
      jersey: standard && standard.jersey && standard.jersey,
      active: standard && standard.active && standard.active,
      pos: standard && standard.pos && standard.pos,
    };
  }

  static mapPlayerStatsFromOracle({
    player,
    team,
    game,
    points,
    pos,
    min,
    fgm,
    fga,
    fgp,
    ftm,
    fta,
    ftp,
    tpm,
    tpa,
    tpp,
    offReb,
    defReb,
    totReb,
    assists,
    pFouls,
    steals,
    turnovers,
    blocks,
    plusMinus,
    comment,
  }): PlayerStatsData {
    return {
      playerId: player.id,
      team,
      gameId: game.id,
      points,
      pos,
      min,
      fgm,
      fga,
      fgp,
      ftm,
      fta,
      ftp,
      tpm,
      tpa,
      tpp,
      offReb,
      defReb,
      totReb,
      assists,
      pFouls,
      steals,
      turnovers,
      blocks,
      plusMinus,
      comment,
    };
  }
}
