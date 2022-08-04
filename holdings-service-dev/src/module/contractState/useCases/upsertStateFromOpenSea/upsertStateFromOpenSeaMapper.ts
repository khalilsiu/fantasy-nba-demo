import { Logger } from '@nestjs/common';

export class UpsertContractMapper {
  static readonly logger = new Logger(UpsertContractMapper.name);

  static async toDomain(doc: any) {}
}
