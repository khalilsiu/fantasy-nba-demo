import { DomainModelCreationError } from 'src/shared/core/AppError';
import { League } from '../domain/league';
import { LeagueDocument } from '../repos/implementations/mongo/schemas/league.schema';

export class LeagueMapper {
  static async mapLeagueToDomain({
    _id,
    name,
    teamIds,
    draftDateTime,
    drafted,
    maxTeams,
    commissionerWalletAddress,
    commissionerFee,
    entryFee,
    isPrivate,
    createdAt,
    deletedAt,
  }: LeagueDocument) {
    const leagueOrError = await League.create({
      _id: _id.toHexString(),
      name,
      teamIds,
      draftDateTime,
      drafted,
      maxTeams,
      commissionerWalletAddress,
      commissionerFee,
      entryFee,
      isPrivate,
      createdAt,
      deletedAt,
    });
    if (leagueOrError.isFailure) {
      throw new DomainModelCreationError(leagueOrError.error.toString());
    }
    return leagueOrError.getValue();
  }
}
