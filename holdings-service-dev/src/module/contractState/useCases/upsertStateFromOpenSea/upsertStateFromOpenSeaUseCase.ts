import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetAllContractsUseCase } from 'src/module/contract/useCases/getAllContracts/getAllContractsUseCase';
import { OpenSeaService } from 'src/module/opensea/OpenSeaService';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { ContractState } from '../../domain/contractState';
import {
  ContractStateRepo,
  CONTRACTSTATE_REPO,
} from '../../repos/contractState.repo';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;
@Injectable()
export class UpsertStateFromOpenSeaUseCase {
  private readonly logger = new Logger(UpsertStateFromOpenSeaUseCase.name);
  constructor(
    private getAllContractsUseCase: GetAllContractsUseCase,
    @Inject(CONTRACTSTATE_REPO) private contractStatseRepo: ContractStateRepo,
  ) {}

  public async exec(): Promise<Response> {
    try {
      this.logger.log(`UpsertStateFromOpenSea`);
      const contractsOrError = await this.getAllContractsUseCase.exec({});

      if (contractsOrError.isLeft()) {
        const error = contractsOrError.value;
        this.logger.error(
          `UpsertStateFromOpenSea getContracts error ${JSON.stringify(error)}`,
        );
        throw new Error(
          `UpsertStateFromOpenSea getContracts error ${JSON.stringify(error)}`,
        );
      }

      const contracts = contractsOrError.value.getValue();

      for (const contract of contracts) {
        const contractStats = await OpenSeaService.fetchContractStats(
          contract.address,
        );
        const contractStatsProps = {
          address: contract.address,
          floorPrice: parseFloat(contractStats.stats.floor_price || 0),
          oneDayVolume: parseFloat(contractStats.stats.one_day_volume || 0),
          sevenDayVolume: parseFloat(contractStats.stats.seven_day_volume || 0),
          thirtyDayVolume: parseFloat(
            contractStats.stats.thirty_day_volume || 0,
          ),
          totalVolume: parseFloat(contractStats.stats.total_volume || 0),
          oneDayAveragePrice: parseFloat(
            contractStats.stats.one_day_average_price || 0,
          ),
          sevenDayAveragePrice: parseFloat(
            contractStats.stats.seven_day_average_price || 0,
          ),
          thirtyDayAveragePrice: parseFloat(
            contractStats.stats.thirty_day_average_price || 0,
          ),
          averagePrice: parseFloat(contractStats.stats.average_price || 0),
          oneDaySales: parseFloat(contractStats.stats.one_day_sales || 0),
          sevenDaySales: parseFloat(contractStats.stats.seven_day_sales || 0),
          thirtyDaySales: parseFloat(contractStats.stats.thirty_day_sales || 0),
          totalSales: parseFloat(contractStats.stats.total_sales || 0),
          numOwners: parseFloat(contractStats.stats.num_owners || 0),
          marketCap: parseFloat(contractStats.stats.market_cap || 0),
          timeAt: new Date(),
        };
        this.logger.log( 
          `UpsertStateFromOpenSea contractStatse ${JSON.stringify(
            contractStatsProps,
          )}`,
        );

        const contractStatsOrError = await ContractState.create(
          contractStatsProps,
        );

        if (contractStatsOrError.isFailure) {
          return left(
            new DomainModelCreationError(contractStatsOrError.error.toString()),
          );
        }
        const contractStatse = contractStatsOrError.getValue();

        this.logger.log( 
          `UpsertStateFromOpenSea contract ${JSON.stringify(contractStatse)}`,
        );

        await this.contractStatseRepo.upsertContractState(contractStatse);
      }

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
