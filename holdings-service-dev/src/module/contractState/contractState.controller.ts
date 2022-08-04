import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ContractStateMapper } from './repos/contractState.repo';
import { GetAllContractStateDTO } from './useCases/getAllContractState/getAllContractStateDTO';
import { GetAllContractStateUseCase } from './useCases/getAllContractState/getAllContractStateUseCase';
import { GetContractStateDTO } from './useCases/getContractState/getContractStateDTO';
import { GetContractStateUseCase } from './useCases/getContractState/getContractStateUseCase';
import { GetHistoricalStateDTO } from './useCases/getHistoricalState/getHistoricalStateDTO';
import { GetHistoricalStateUseCase } from './useCases/getHistoricalState/getHistoricalStateUseCase';
import { UpsertStateFromOpenSeaUseCase } from './useCases/upsertStateFromOpenSea/upsertStateFromOpenSeaUseCase';

@Controller('/contract-state')
export class ContractStateController {
  private readonly logger = new Logger(ContractStateController.name);
  constructor(
    private upsertStateFromOpenSeaUseCase: UpsertStateFromOpenSeaUseCase,
    private getContractStateUseCase: GetContractStateUseCase,
    private getHistoricalStateUseCase: GetHistoricalStateUseCase,
    private getAllContractStateUseCase: GetAllContractStateUseCase,
  ) {}

  @Post('/all')
  async upsertStateFromOpenSea() {
    this.logger.log(`[POST] UpsertStateFromOpenSea`);
    this.upsertStateFromOpenSeaUseCase.exec();

    return HttpStatus.CREATED;
  }
  @Get()
  async getContractState(@Query() getContractStateDTO: GetContractStateDTO) {
    this.logger.log(`[GET] getContractState`);
    const { address } = getContractStateDTO;
    const result = await this.getContractStateUseCase.exec({ address });

    this.logger.log(`getContractState result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getContractState error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return ContractStateMapper.toDTO(result.value.getValue());
  }

  @Get('/all')
  async getAllContractState() {
    this.logger.log(`[GET] getContractState`);
    const result = await this.getAllContractStateUseCase.exec();

    this.logger.log(`getContractState result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getContractState error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    const contractStates = result.value.getValue();
    return contractStates.map((state) =>
      ContractStateMapper.toWithInfoDTO(state),
    );
  }

  @Get('/historical')
  async getHistoricalState(
    @Query() getHistoricalStateDTO: GetHistoricalStateDTO,
  ) {
    this.logger.log(`[GET] getHistoricalState`);
    const { address, page } = getHistoricalStateDTO;
    const result = await this.getHistoricalStateUseCase.exec({ address, page });

    this.logger.log(`getHistoricalState`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getHistoricalState error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    const historicalState = result.value.getValue();
    return historicalState.map((state) => ContractStateMapper.toDTO(state));
  }
}
