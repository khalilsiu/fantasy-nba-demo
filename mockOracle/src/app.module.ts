import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './module/data/data.module';
import { WinstonModule } from 'nest-winston';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataModule,
    WinstonModule,
    ScheduleModule.forRoot(),
  ],
  providers: [Logger],
})
export class AppModule {}
