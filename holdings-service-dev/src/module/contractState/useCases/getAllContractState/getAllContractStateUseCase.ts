import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetAllContractsUseCase } from 'src/module/contract/useCases/getAllContracts/getAllContractsUseCase';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import {
  ContractStateRepo,
  CONTRACTSTATE_REPO,
} from '../../repos/contractState.repo';
import { keyBy } from 'lodash';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<any[]>
>;
@Injectable()
export class GetAllContractStateUseCase {
  private readonly logger = new Logger(GetAllContractStateUseCase.name);
  constructor(
    @Inject(CONTRACTSTATE_REPO) private contractStateRepo: ContractStateRepo,
    private getAllContractsUseCase: GetAllContractsUseCase,
  ) {}

  public async exec(): Promise<Response> {
    try {
      this.logger.log(`GetContractState`);
      const contractStates = await this.contractStateRepo.getAllContractState();

      const contractsOrError = await this.getAllContractsUseCase.exec({});

      if (contractsOrError.isLeft()) {
        const error = contractsOrError.value;
        this.logger.error(
          `GetAllContractState getAllContracts error ${JSON.stringify(error)}`,
        );
        throw new Error(
          `GetAllContractState getAllContracts error ${JSON.stringify(error)}`,
        );
      }

      const contracts = contractsOrError.value.getValue();

      const contractsDTO = contracts.map(
        ({
          address,
          blockNumber,
          status,
          signatures,
          featureKeys,
          botConfig,
        }) => ({
          address,
          blockNumber,
          status,
          signatures,
          featureKeys,
          botConfig,
        }),
      );

      const indexedContracts = keyBy(contractsDTO, 'address');

      const contractStatesToSend = contractStates.map((state) => ({
        ...state,
        ...indexedContracts[state.address],
      }));

      this.logger.log(
        `GetContractState contractState ${JSON.stringify(
          contractStatesToSend,
        )}`,
      );

      return right(Result.ok<any[]>(contractStatesToSend));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
