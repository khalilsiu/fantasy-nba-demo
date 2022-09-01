export default class OracleMappper {
    static mapPlayer ({id, firstname, lastname, birth, nba, height, weight, college, affiliation, leagues}) {
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
            jersey: leagues.standard
        }
    }
}