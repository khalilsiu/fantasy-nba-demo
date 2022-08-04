import { Module } from '@nestjs/common';

import { OpenSeaService } from './OpenSeaService';

@Module({
  providers: [OpenSeaService],
  exports: [OpenSeaService],
})
export class OpenSeaModule {}
