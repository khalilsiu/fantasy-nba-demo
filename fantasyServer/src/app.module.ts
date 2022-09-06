import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerModule } from './module/players/player.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ConfigModule.forRoot(),
    PlayerModule,
    WinstonModule,
    ScheduleModule.forRoot(),
  ],
  providers: [Logger],
})
export class AppModule {}
