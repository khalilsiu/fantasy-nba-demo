import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { LogTransactionDTO } from './useCases/logTransaction/logTransactionDTO';
import { LogTransactionUseCase } from './useCases/logTransaction/logTransactionUseCase';
import { camelize } from 'src/shared/utils';
import { TransactionMapper } from './transaction.mapper';
@Controller('/transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private logTransactionUseCase: LogTransactionUseCase) {}

  @Post('/')
  async logTransaction(@Body() body: LogTransactionDTO) {
    this.logger.log(`[POST] logTransaction`);

    const { event, address } = body;
    const props = {
      ...camelize(event),
      address,
      timestamp: new Date(event.timestamp),
    };

    const result = await this.logTransactionUseCase.exec(props);
    this.logger.log(`logTransaction result isRight ${result.isRight()}`);

    if (result.isLeft()) {
      const error = result.value;
      this.logger.error(`logTransaction error ${JSON.stringify(error)}`);
      switch (error.constructor.name) {
        default:
          throw new HttpException(
            error.errorValue().message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    return TransactionMapper.toDTO(result.value.getValue());
  }
}
