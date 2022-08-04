import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { FetchFromSourceDTO } from './useCases/fetchFromSource/fetchFromSourceDTO';
import { FetchFromSourceUseCase } from './useCases/fetchFromSource/fetchFromSourceUseCase';
import { AssetMapper } from './asset.mapper';
import { GetAssetByFilterUseCase } from './useCases/getAssetByFilter/getAssetByFilterUseCase';
import { GetFloorAssetByFilterDTO } from './useCases/getAssetByFilter/getAssetByFilterDTO';
@Controller('/asset')
export class AssetController {
  private readonly logger = new Logger(AssetController.name);
  constructor(
    private fetchFromSourceUseCase: FetchFromSourceUseCase,
    private getAssetByFilterUseCase: GetAssetByFilterUseCase,
  ) {}

  @Post('/floor-price')
  async getFloorPriceByFilter(@Body() body: GetFloorAssetByFilterDTO) {
    const { traits, address } = body;
    this.logger.log(`[POST] getFloorPriceByFilter`);
    const result = await this.getAssetByFilterUseCase.exec({
      address,
      traitFilter: traits,
      floor: true,
    });
    this.logger.log(`getFloorPriceByFilter done`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getFloorPriceByFilter error ${JSON.stringify(error)}`);
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
    return AssetMapper.toFloorPriceDTO(result.value.getValue()[0]);
  }

  @Post('/fetch-from-source')
  async fetchFromSource(@Body() body: FetchFromSourceDTO) {
    const { address, tokenId } = body;
    this.logger.log(`[POST] fetchFromSource`);
    const result = await this.fetchFromSourceUseCase.exec(address, tokenId);

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

    return;
  }
}
