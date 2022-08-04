import { IsOptional, IsBoolean, IsArray, IsString } from 'class-validator';

export class GetAllContractsDTO {
  @IsOptional()
  @IsBoolean()
  isReadyToUpdate?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featureKeys?: string[];
}
