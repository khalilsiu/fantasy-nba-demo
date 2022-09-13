import { DomainModelCreationError } from 'src/shared/core/AppError';
import { Team } from '../domain/team';
import { TeamDocument } from '../repos/implementations/mongo/schemas/team.schema';

export class TeamMapper {
  static async mapTeamToDomain({
    _id,
    leagueId,
    walletAddress,
    name,
    roster,
    wins,
    losses,
    ties,
    moves,
    waiverRank,
    createdAt,
    deletedAt,
  }: TeamDocument) {
    const teamOrError = await Team.create({
      _id: _id.toHexString(),
      leagueId: leagueId.toHexString(),
      walletAddress,
      name,
      roster,
      wins,
      losses,
      ties,
      moves,
      waiverRank,
      createdAt,
      deletedAt,
    });
    if (teamOrError.isFailure) {
      throw new DomainModelCreationError(teamOrError.error.toString());
    }
    return teamOrError.getValue();
  }
}
