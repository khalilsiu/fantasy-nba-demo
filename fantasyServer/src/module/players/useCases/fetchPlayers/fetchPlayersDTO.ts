import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class FetchPlayersDTO {
  @IsNumber()
  @Min(1)
  @Max(30)
  @Type(() => Number)
  team: number;

  @IsNumber()
  @Type(() => Number)
  season: number;
}
