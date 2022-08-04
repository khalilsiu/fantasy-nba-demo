import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
  Post,
} from '@nestjs/common';
import { ContractMapper } from '../contract/contract.mapper';
import { Contract } from '../contract/domain/contract';
import { GetHoldingsDTO } from './useCases/getHoldings/getHoldingsDTO';
import { GetHoldingsUseCase } from './useCases/getHoldings/getHoldingsUseCase';
import { UpdateAllContractHoldingsUseCase } from './useCases/updateAllContractHoldings/updateAllContractHoldingsUseCase';

@Controller('/holders')
export class HolderController {
  private readonly logger = new Logger(HolderController.name);
  constructor(
    private getHoldingsUseCase: GetHoldingsUseCase,
    private updateAllContractHoldingsUseCase: UpdateAllContractHoldingsUseCase,
  ) {}

  @Get()
  async getHoldings(@Query() getHoldingsDTO: GetHoldingsDTO) {
    this.logger.log(`[GET] getHoldings`);
    const { contractAddress } = getHoldingsDTO;
    const result = await this.getHoldingsUseCase.exec(contractAddress);

    this.logger.log(`getHoldings result ${JSON.stringify(result)}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`getHoldings error ${JSON.stringify(error)}`);
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

  @Post('/all')
  async updateAllContractHoldings() {
    this.logger.log(`[POST] updateAllContractHoldings`);
    this.logger.log(`updateAllContractHoldings updating...`);

    const contracts =
      await this.updateAllContractHoldingsUseCase.getAllReadyToTrackContracts();
    this.updateAllContractHoldingsUseCase.exec(contracts);

    return contracts.map((contract) => ({ address: contract.address }));
  }
}
