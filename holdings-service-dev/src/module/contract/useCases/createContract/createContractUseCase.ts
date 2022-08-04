import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Contract } from '../../domain/contract';
import { CONTRACT_REPO, ContractRepo } from '../../repos/contract.repo';

import { CreateContractDTO } from './createContractDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Contract>
>;
@Injectable()
export class CreateContractUseCase {
  private readonly logger = new Logger(CreateContractUseCase.name);
  constructor(@Inject(CONTRACT_REPO) private contractRepo: ContractRepo) {}

  public async exec(createContractDTO: CreateContractDTO): Promise<Response> {
    try {
      const { address, signatures, featureKeys, botConfig } = createContractDTO;

      this.logger.log(`CreateContract`);

      const contractOrError = await Contract.create({
        address,
        status: 'READY',
        blockNumber: 0,
        signatures,
        featureKeys,
        botConfig,
      });

      this.logger.log(
        `createContract contractOrError ${JSON.stringify(contractOrError)}`,
      );

      if (contractOrError.isFailure) {
        return left(
          new DomainModelCreationError(contractOrError.error.toString()),
        );
      }
      const contract = contractOrError.getValue();
      this.logger.log(`createContract contract ${JSON.stringify(contract)}`);

      const saved = await this.contractRepo.createContract(contract);

      this.logger.log(`CreateContract logs saved ${JSON.stringify(saved)}`);

      return right(Result.ok<Contract>(saved));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
