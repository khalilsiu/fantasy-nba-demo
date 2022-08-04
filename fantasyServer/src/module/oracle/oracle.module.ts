import { Module } from '@nestjs/common';

import { OracleService } from './OracleService';

@Module({
  providers: [OracleService],
  exports: [OracleService],
})
export class OracleModule {}
