import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Contract } from '../../domain/contract';
import { CONTRACT_REPO, ContractRepo } from '../../repos/contract.repo';

import { UpdateContractDTO } from './updateContractDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Contract>
>;
@Injectable()
export class UpdateContractUseCase {
  private readonly logger = new Logger(UpdateContractUseCase.name);
  constructor(@Inject(CONTRACT_REPO) private contractRepo: ContractRepo) {}

  public async exec(updateContractDTO: UpdateContractDTO): Promise<Response> {
    try {
      const {
        address,
        status,
        blockNumber,
        signatures,
        featureKeys,
        botConfig,
      } = updateContractDTO;

      this.logger.log(
        `UpdateContract props ${JSON.stringify(updateContractDTO)}`,
      );

      const contract = await this.contractRepo.updateContract({
        address,
        status,
        blockNumber,
        signatures,
        featureKeys,
        botConfig,
      });

      this.logger.log(`UpdateContract logs saved`);

      return right(Result.ok<Contract>(contract));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
