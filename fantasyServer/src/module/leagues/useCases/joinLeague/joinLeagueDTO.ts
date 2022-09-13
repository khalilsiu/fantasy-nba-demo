import { IsString, IsOptional } from 'class-validator';

export default class JoinLeagueDTO {
  @IsString()
  leagueId: string;

  @IsString()
  walletAddress: string;

  @IsString()
  @IsOptional()
  name?: string;
}
