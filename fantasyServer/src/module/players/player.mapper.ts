export interface PlayerData {
  playerId: number;
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
      playerId: id,
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
}
