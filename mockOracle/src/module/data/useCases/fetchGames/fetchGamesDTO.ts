import { Type } from 'class-transformer';
import { IsDateString, IsNumber, Min, ValidateIf } from 'class-validator';

export class FetchGamesDTO {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ValidateIf((o) => !o.date || o.id)
  id: number;

  @IsDateString()
  @ValidateIf((o) => !o.id || o.date)
  date: string;
}
