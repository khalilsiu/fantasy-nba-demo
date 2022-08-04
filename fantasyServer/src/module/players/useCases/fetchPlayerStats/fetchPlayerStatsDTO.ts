import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class FetchPlayerStatsDTO {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  id: number;

  @IsNumber()
  @Type(() => Number)
  season: number;
}
