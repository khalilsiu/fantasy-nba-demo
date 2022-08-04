import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateContractBodyDTO,
  CreateContractQueryDTO,
} from './useCases/createContract/createContractDTO';
import { CreateContractUseCase } from './useCases/createContract/createContractUseCase';
import { GetAllContractsUseCase } from './useCases/getAllContracts/getAllContractsUseCase';
import { GetContractDTO } from './useCases/getContract/getContractDTO';
import { GetContractUseCase } from './useCases/getContract/getContractUseCase';
import { ContractMapper } from './contract.mapper';
import {
  UpdateContractQueryDTO,
  UpdateContractBodyDTO,
} from './useCases/updateContract/updateContractDTO';
import { UpdateContractUseCase } from './useCases/updateContract/updateContractUseCase';

@Controller('/contract')
export class ContractController {
  private readonly logger = new Logger(ContractController.name);
  constructor(
    private getContractUserCase: GetContractUseCase,
    private getAllContractsUseCase: GetAllContractsUseCase,
    private createContractUserCase: CreateContractUseCase,
    private updateContractUserCase: UpdateContractUseCase,
  ) {}

  @Patch()
  async updateContract(
    @Query() query: UpdateContractQueryDTO,
    @Body() body: UpdateContractBodyDTO,
  ) {
    this.logger.log(`[POST] createContract`);
    const { address } = query;
    const { status, blockNumber, signatures, featureKeys, botConfig } = body;

    const result = await this.updateContractUserCase.exec({
      address,
      status,
      blockNumber,
      signatures,
      featureKeys,
      botConfig,
    });

    this.logger.log(
      `createContract result isRight ${JSON.stringify(result.isRight())}`,
    );

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`createContract error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return ContractMapper.toDTO(result.value.getValue());
  }

  @Post()
  async createContract(
    @Query() query: CreateContractQueryDTO,
    @Body() body: CreateContractBodyDTO,
  ) {
    this.logger.log(`[POST] createContract`);
    const { address } = query;
    const { signatures, featureKeys, botConfig } = body;

    const result = await this.createContractUserCase.exec({
      address,
      signatures,
      featureKeys,
      botConfig,
    });

    this.logger.log(
      `createContract result isRight ${JSON.stringify(result.isRight())}`,
    );

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`createContract error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return ContractMapper.toDTO(result.value.getValue());
  }

  @Get()
  async getContract(@Query() getContractDTO: GetContractDTO) {
    this.logger.log(`[GET] getContract`);
    const { address } = getContractDTO;
    const result = await this.getContractUserCase.exec({ address });

    this.logger.log(
      `getContract result isRight ${JSON.stringify(result.isRight())}`,
    );

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getContract error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    return ContractMapper.toDTO(result.value.getValue());
  }

  @Get('/all')
  async getAllContracts() {
    this.logger.log(`[GET] getAllContracts`);
    const result = await this.getAllContractsUseCase.exec({});

    this.logger.log(`getAllContracts result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getContract error ${JSON.stringify(error)}`);
      switch (error.constructor) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    const contracts = result.value.getValue();
    return contracts.map((contract) => ContractMapper.toDTO(contract));
  }
}
