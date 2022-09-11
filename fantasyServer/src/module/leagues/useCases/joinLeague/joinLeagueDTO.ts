import { IsString } from 'class-validator';

export default class JoinLeagueDTO {
  @IsString()
  leagueId: string;

  @IsString()
  walletAddress: string;
}
