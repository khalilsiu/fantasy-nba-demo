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
import { GetContractStateDTO } from './getContractStateDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<ContractState>
>;
@Injectable()
export class GetContractStateUseCase {
  private readonly logger = new Logger(GetContractStateUseCase.name);
  constructor(
    @Inject(CONTRACTSTATE_REPO) private contractStateRepo: ContractStateRepo,
  ) {}

  public async exec(
    getContractStateDTO: GetContractStateDTO,
  ): Promise<Response> {
    try {
      this.logger.log(`GetContractState`);
      const { address } = getContractStateDTO;
      const contractState = await this.contractStateRepo.getContractState(
        address,
      );

      if (!contractState) {
        throw new Error(`Contract state of ${address} does not exist.`);
      }

      this.logger.log( 
        `GetContractState contractState ${JSON.stringify(contractState)}`,
      );

      return right(Result.ok<ContractState>(contractState));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
