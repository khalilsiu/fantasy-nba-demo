import {
  Controller,
  Logger,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetLeaseDTO } from './useCases/getLeases/getLeasesByFilterDTO';
import { GetLeasesByFilterUseCase } from './useCases/getLeases/getLeasesByFilterUseCase';
import { UpsertLeaseDTO } from './useCases/upsertLease/upsertLeaseDTO';
import { UpsertLeaseUseCase } from './useCases/upsertLease/upsertLeaseUseCase';
import { AssetWithLeaseMapper, LeaseMapper } from './lease.mapper';
import { camelCase } from 'lodash';
import { AcceptLeaseDTO } from './useCases/acceptLease/acceptLeaseDTO';
import { AcceptLeaseUseCase } from './useCases/acceptLease/acceptLeaseUseCase';
import { PayRentDTO } from './useCases/payRent/payRentDTO';
import { PayRentUseCase } from './useCases/payRent/payRentUseCase';
import { CancelLeaseDTO } from './useCases/cancelLease/cancelLeaseDTO';
import { CancelLeaseUseCase } from './useCases/cancelLease/cancelLeaseUseCase';
@Controller('/lease')
export class LeaseController {
  private readonly logger = new Logger(LeaseController.name);
  constructor(
    private upsertLeaseUseCase: UpsertLeaseUseCase,
    private getLeasesUseCase: GetLeasesByFilterUseCase,
    private acceptLeaseUseCase: AcceptLeaseUseCase,
    private payRentUseCase: PayRentUseCase,
    private cancelLeaseUseCase: CancelLeaseUseCase,
  ) {}

  @Post()
  async upsertLease(@Body() body: UpsertLeaseDTO) {
    this.logger.log(`[POST] upsertLease`);

    const result = await this.upsertLeaseUseCase.exec(body);

    this.logger.log(`upsertLease result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`upsertLease error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return LeaseMapper.toDTO(result.value.getValue());
  }

  @Post('/accept')
  async acceptLease(@Body() body: AcceptLeaseDTO) {
    this.logger.log(`[POST] acceptLease`);

    const result = await this.acceptLeaseUseCase.exec(body);

    this.logger.log(`acceptLease result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`acceptLease error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return LeaseMapper.toDTO(result.value.getValue());
  }

  @Post('/cancel')
  async cancelLease(@Body() body: CancelLeaseDTO) {
    this.logger.log(`[POST] cancelLease`);

    const result = await this.cancelLeaseUseCase.exec(body);

    this.logger.log(`cancelLease result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`cancelLease error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return LeaseMapper.toDTO(result.value.getValue());
  }

  @Post('/filter')
  async getLeasesByFilter(@Body() body: GetLeaseDTO) {
    this.logger.log(`[POST] getLeasesByFilter`);
    const payload = {
      ...body,
      sort:
        body.sort &&
        body.sort.map((sort) => ({
          ...sort,
          field: camelCase(sort.field),
        })),
    };

    const result = await this.getLeasesUseCase.exec(payload);
    this.logger.log(`getLeasesByFilter result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getLeasesByFilter error ${JSON.stringify(error)}`);
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
    const assetsWithLease = result.value.getValue();
    return assetsWithLease.map((assetWithLease) =>
      AssetWithLeaseMapper.toDTO(assetWithLease),
    );
  }

  @Post('/pay-rent')
  async payRent(@Body() body: PayRentDTO) {
    this.logger.log(`[POST] payRent`);

    const result = await this.payRentUseCase.exec(body);

    this.logger.log(`payRent result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`payRent error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return LeaseMapper.toDTO(result.value.getValue());
  }
}
