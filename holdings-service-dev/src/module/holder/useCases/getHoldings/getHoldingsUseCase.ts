import { Inject, Injectable, Logger } from '@nestjs/common';
import { ContractMapper } from 'src/module/contract/contract.mapper';
import { Contract } from 'src/module/contract/domain/contract';
import { GetContractUseCase } from 'src/module/contract/useCases/getContract/getContractUseCase';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { HolderProps } from '../../domain/holder';
import { HolderRepo, HOLDER_REPO } from '../../repos/holder.repo';
import { GetHoldingsResDTO } from './getHoldingsDTO';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<GetHoldingsResDTO>
>;

@Injectable()
export class GetHoldingsUseCase {
  private readonly logger = new Logger(GetHoldingsUseCase.name);
  constructor(
    @Inject(HOLDER_REPO) private holderRepo: HolderRepo,
    private getContractUseCase: GetContractUseCase,
  ) {}
  public async exec(contractAddress: string): Promise<Response> {
    try {
      this.logger.log(`GetHoldingsUseCase exec`);

      const contractOrError = await this.getContractUseCase.exec({
        address: contractAddress,
      });

      if (contractOrError.isLeft()) {
        const error = contractOrError.value;
        this.logger.error(
          `GetHoldingsUseCase getContract error ${JSON.stringify(error)}`,
        );
        throw new Error(
          `GetHoldingsUseCase getContract error ${JSON.stringify(error)}`,
        );
      }
      const contract = contractOrError.value.getValue();
      if (!contract) {
        throw new Error('GetHoldingsUseCase getContract not found');
      }
      if (contract.status !== 'READY') {
        return right(
          Result.ok({
            status: contract.status,
            address: contract.address,
            holdings: [],
          }),
        );
      }

      const holdings = await this.holderRepo.getHoldings(contract.address);

      this.logger.log(`GetHoldings holdings ${JSON.stringify(holdings)}`);

      return right(
        Result.ok({
          status: contract.status,
          address: contract.address,
          holdings,
        }),
      );
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
