import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './shared/ValidationPipe';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';

const loggingWinston = new LoggingWinston();

const winstonlogging = WinstonModule.createLogger({
    // options (same as WinstonModule.forRoot() options)
    level: 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(`mock-oracle`, {
            prettyPrint: true,
          }),
        ),
      }),
      // Add Stackdriver Logging
      loggingWinston,
    ],
  })

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}
bootstrap();
