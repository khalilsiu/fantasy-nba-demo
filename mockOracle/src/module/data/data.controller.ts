import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { FetchGamesDTO } from './useCases/fetchGames/fetchGamesDTO';
import { FetchGamesUseCase } from './useCases/fetchGames/fetchGamesUseCase';
import { FetchPlayersDTO } from './useCases/fetchPlayers/fetchPlayersDTO';
import { FetchPlayersUseCase } from './useCases/fetchPlayers/fetchPlayersUseCase';
import { FetchPlayerStatsDTO } from './useCases/fetchPlayerStats/fetchPlayerStatsDTO';
import { FetchPlayerStatsUseCase } from './useCases/fetchPlayerStats/fetchPlayerStatsUseCase';

@Controller('/data')
export class DataController {
  private readonly logger = new Logger(DataController.name);
  constructor(
    private fetchPlayersUseCase: FetchPlayersUseCase,
    private fetchPlayerStatsUseCase: FetchPlayerStatsUseCase,
    private fetchGamesUseCase: FetchGamesUseCase,
  ) {}

  @Get('/players')
  async getPlayers(@Query() query: FetchPlayersDTO) {
    const { team, season } = query;
    this.logger.log(`[POST] getPlayers`);
    const result = await this.fetchPlayersUseCase.exec(team, season);
    this.logger.log(`getPlayers done`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getPlayers error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        case 'NotFoundError': {
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.NOT_FOUND,
          );
        }
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

  @Get('/player-statistics')
  async getPlayerStats(@Query() query: FetchPlayerStatsDTO) {
    const { id, season } = query;
    this.logger.log(`[POST] getPlayerStats`);
    const result = await this.fetchPlayerStatsUseCase.exec(id, season);
    this.logger.log(`getPlayerStats done`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getPlayerStats error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        case 'NotFoundError': {
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.NOT_FOUND,
          );
        }
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

  @Get('/games')
  async getGames(@Query() query: FetchGamesDTO) {
    const { id, date } = query;
    this.logger.log(`[POST] getGames`);
    const result = await this.fetchGamesUseCase.exec(id, date);
    this.logger.log(`getGames done`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getGames error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        case 'NotFoundError': {
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.NOT_FOUND,
          );
        }
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
