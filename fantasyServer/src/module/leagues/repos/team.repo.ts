import { Team } from '../domain/team';

export const TEAM_REPO = 'TEAM REPO';

export interface TeamRepo {
  bulkUpsertTeam(teams: Team[]): Promise<void>;
  findTeamById(teamId: string): Promise<Team | null>;
}
