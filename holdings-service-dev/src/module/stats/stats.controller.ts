import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  Query,
} from '@nestjs/common';
import { FetchFromSourceDTO } from './useCases/fetchFromSource/fetchFromSourceDTO';
import { FetchFromSourceUseCase } from './useCases/fetchFromSource/fetchFromSourceUseCase';

@Controller('/stats')
export class StatsController {
  private readonly logger = new Logger(StatsController.name);
  constructor(private fetchFromSourceUseCase: FetchFromSourceUseCase) {}

  @Get()
  async fetchFromSource(@Query() fetchFromSourceDTO: FetchFromSourceDTO) {
    this.logger.log(`[GET] fetchFromSource`);
    const { metaverse } = fetchFromSourceDTO;
    const result = await this.fetchFromSourceUseCase.exec(metaverse);

    this.logger.log(
      `fetchFromSource result isRight ${JSON.stringify(result.isRight())}`,
    );

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`fetchFromSource error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    return result.value.getValue();
  }
}
