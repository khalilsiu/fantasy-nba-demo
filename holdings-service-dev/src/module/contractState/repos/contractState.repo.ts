import { Logger } from '@nestjs/common';
import { ContractState, ContractStateProps } from '../domain/contractState';

export const CONTRACTSTATE_REPO = 'CONTRACTSTATE REPO';

export interface ContractStateRepo {
  upsertContractState(contractState: ContractState): Promise<void>;
  getContractState(address: string): Promise<ContractState | null>;
  getAllContractState(): Promise<ContractStateProps[]>;
  getHistoricalState(address: string, page: number): Promise<ContractState[]>;
}

export class ContractStateMapper {
  static readonly logger = new Logger(ContractStateMapper.name);

  static async toDomain(doc: any): Promise<ContractState> {
    const {
      address,
      floorPrice,
      oneDayVolume,
      sevenDayVolume,
      thirtyDayVolume,
      totalVolume,
      oneDayAveragePrice,
      sevenDayAveragePrice,
      thirtyDayAveragePrice,
      averagePrice,
      oneDaySales,
      sevenDaySales,
      thirtyDaySales,
      totalSales,
      numOwners,
      marketCap,
      timeAt,
    } = doc;
    const contractStateOrError = await ContractState.create({
      address,
      floorPrice,
      oneDayVolume,
      sevenDayVolume,
      thirtyDayVolume,
      totalVolume,
      oneDayAveragePrice,
      sevenDayAveragePrice,
      thirtyDayAveragePrice,
      averagePrice,
      oneDaySales,
      sevenDaySales,
      thirtyDaySales,
      totalSales,
      numOwners,
      marketCap,
      timeAt: new Date(timeAt),
    });
    this.logger.log( 
      `toDomain contractStateOrError ${JSON.stringify(contractStateOrError)}`,
    );

    if (contractStateOrError.isFailure) {
      throw new Error('GetContractStateMapper map to domain failed.');
    }
    return contractStateOrError.getValue();
  }

  static toDTO(contractState: ContractState | ContractStateProps) {
    const {
      address,
      floorPrice,
      oneDayVolume,
      sevenDayVolume,
      thirtyDayVolume,
      totalVolume,
      oneDayAveragePrice,
      sevenDayAveragePrice,
      thirtyDayAveragePrice,
      averagePrice,
      oneDaySales,
      sevenDaySales,
      thirtyDaySales,
      totalSales,
      numOwners,
      marketCap,
      timeAt,
    } = contractState;
    return {
      address,
      floor_price: floorPrice,
      one_day_volume: oneDayVolume,
      seven_day_volume: sevenDayVolume,
      thirty_day_volume: thirtyDayVolume,
      total_volume: totalVolume,
      one_day_sales: oneDaySales,
      seven_day_sales: sevenDaySales,
      thirty_day_sales: thirtyDaySales,
      total_sales: totalSales,
      one_day_average_price: oneDayAveragePrice,
      seven_day_average_price: sevenDayAveragePrice,
      thirty_day_average_price: thirtyDayAveragePrice,
      total_average_price: averagePrice,
      num_owners: numOwners,
      market_cap: marketCap,
      time_at: timeAt,
    };
  }

  static toWithInfoDTO(contractState: any) {
    const {
      address,
      floorPrice,
      oneDayVolume,
      sevenDayVolume,
      thirtyDayVolume,
      totalVolume,
      oneDayAveragePrice,
      sevenDayAveragePrice,
      thirtyDayAveragePrice,
      averagePrice,
      oneDaySales,
      sevenDaySales,
      thirtyDaySales,
      totalSales,
      numOwners,
      marketCap,
      timeAt,
      blockNumber,
      status,
      signatures,
      featureKeys,
      botConfig,
    } = contractState;
    return {
      address,
      floor_price: floorPrice,
      one_day_volume: oneDayVolume,
      seven_day_volume: sevenDayVolume,
      thirty_day_volume: thirtyDayVolume,
      total_volume: totalVolume,
      one_day_sales: oneDaySales,
      seven_day_sales: sevenDaySales,
      thirty_day_sales: thirtyDaySales,
      total_sales: totalSales,
      one_day_average_price: oneDayAveragePrice,
      seven_day_average_price: sevenDayAveragePrice,
      thirty_day_average_price: thirtyDayAveragePrice,
      total_average_price: averagePrice,
      num_owners: numOwners,
      market_cap: marketCap,
      time_at: timeAt,
      block_number: blockNumber,
      status,
      signatures,
      feature_keys: featureKeys,
      bot_config: botConfig,
    };
  }
}
