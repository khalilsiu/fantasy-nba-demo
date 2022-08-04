import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { ContractState } from '../../domain/contractState';
import {
  ContractStateRepo,
  CONTRACTSTATE_REPO,
} from '../../repos/contractState.repo';
import { GetHistoricalStateDTO } from './getHistoricalStateDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<ContractState[]>
>;
@Injectable()
export class GetHistoricalStateUseCase {
  private readonly logger = new Logger(GetHistoricalStateUseCase.name);
  constructor(
    @Inject(CONTRACTSTATE_REPO) private contractStateRepo: ContractStateRepo,
  ) {}

  public async exec(
    getContractStateDTO: GetHistoricalStateDTO,
  ): Promise<Response> {
    try {
      this.logger.log(`GetHistoricalState`);
      const { address, page } = getContractStateDTO;
      const contractStates = await this.contractStateRepo.getHistoricalState(
        address,
        page,
      );

      this.logger.log( 
        `GetHistoricalState contractState length ${contractStates.length}`,
      );

      return right(Result.ok<ContractState[]>(contractStates));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
