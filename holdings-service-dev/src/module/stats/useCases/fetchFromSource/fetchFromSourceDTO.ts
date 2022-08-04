import { IsEnum, Length } from 'class-validator';
import { METAVERSE } from '../../domain/dclStats';

export class FetchFromSourceDTO {
  @IsEnum(METAVERSE)
  @Length(2, 255)
  metaverse?: string;
}
