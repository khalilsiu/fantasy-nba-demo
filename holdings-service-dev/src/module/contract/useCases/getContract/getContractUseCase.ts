import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Contract } from '../../domain/contract';
import { CONTRACT_REPO, ContractRepo } from '../../repos/contract.repo';

import { GetContractDTO } from './getContractDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Contract>
>;

@Injectable()
export class GetContractUseCase {
  private readonly logger = new Logger(GetContractUseCase.name);
  constructor(@Inject(CONTRACT_REPO) private contractRepo: ContractRepo) {}

  public async exec(getContractDTO: GetContractDTO): Promise<Response> {
    try {
      const { address } = getContractDTO;

      this.logger.log(`GetContract`);

      const contract = await this.contractRepo.getContract(address);

      this.logger.log(`getContract contract ${JSON.stringify(contract)}`);

      if (!contract) {
        throw new Error('Contract not found.');
      }

      return right(Result.ok<Contract>(contract));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
