import { Inject, Injectable, Logger } from '@nestjs/common';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { Contract } from '../../domain/contract';
import { CONTRACT_REPO, ContractRepo } from '../../repos/contract.repo';
import { GetAllContractsDTO } from './getAllContractsDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<Contract[]>
>;

@Injectable()
export class GetAllContractsUseCase {
  private readonly logger = new Logger(GetAllContractsUseCase.name);
  constructor(@Inject(CONTRACT_REPO) private contractRepo: ContractRepo) {}

  public async exec(getAllContractsDTO: GetAllContractsDTO): Promise<Response> {
    try {
      this.logger.log(`GetContract`);

      const { isReadyToUpdate, featureKeys } = getAllContractsDTO;

      const contracts = await this.contractRepo.getAllContracts(
        isReadyToUpdate,
        featureKeys,
      );

      this.logger.log(`getContract contract ${JSON.stringify(contracts)}`);

      return right(Result.ok<Contract[]>(contracts));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
