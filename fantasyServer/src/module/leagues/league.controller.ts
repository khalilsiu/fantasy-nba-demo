import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Body,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { UpsertLeaguesUseCase } from './useCases/upsertLeagues/upsertLeaguesUseCase';
import UpsertLeagueDTO from './useCases/upsertLeagues/upsertLeaguesDTO';
import { JoinLeagueUseCase } from './useCases/joinLeague/joinLeagueUseCase';
import JoinLeagueDTO from './useCases/joinLeague/joinLeagueDTO';

@Controller('/league')
export class LeagueController {
  private readonly logger = new Logger(LeagueController.name);
  constructor(
    private upsertLeaguesUseCase: UpsertLeaguesUseCase,
    private joinLeagueUseCase: JoinLeagueUseCase,
  ) {}

  @Post()
  async upsertLeague(@Body() body: UpsertLeagueDTO) {
    this.logger.log(`[POST] upsertLeague`);
    const result = await this.upsertLeaguesUseCase.exec(body);
    this.logger.log(`upsertLeague done`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`upsertLeague error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    // exception is being thrown if not found
    return result.value.getValue();
  }

  @Get('/join')
  async joinLeague(@Query() query: JoinLeagueDTO) {
    this.logger.log(`[POST] joinLeague`);
    const result = await this.joinLeagueUseCase.exec(query);
    this.logger.log(`joinLeague done`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`joinLeague error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        case 'NotFoundError':
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.NOT_FOUND,
          );
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    // exception is being thrown if not found
    return result.value.getValue();
  }
}
