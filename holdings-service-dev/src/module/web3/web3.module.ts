import { Module } from '@nestjs/common';

import { Web3Service } from './Web3Service';

@Module({
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
