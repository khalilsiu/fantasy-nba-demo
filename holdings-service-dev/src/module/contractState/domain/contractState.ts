import { Logger } from '@nestjs/common';
import {
  IsDate,
  IsEthereumAddress,
  IsNumber,
  Length,
  validate,
} from 'class-validator';
import { Result } from 'src/shared/core/Result';

export interface ContractStateProps {
  address: string;
  floorPrice: number;
  oneDayVolume: number;
  sevenDayVolume: number;
  thirtyDayVolume: number;
  totalVolume: number;
  oneDayAveragePrice: number;
  sevenDayAveragePrice: number;
  thirtyDayAveragePrice: number;
  averagePrice: number;
  oneDaySales: number;
  sevenDaySales: number;
  thirtyDaySales: number;
  totalSales: number;
  numOwners: number;
  marketCap: number;
  timeAt: Date;
}

export class ContractState {
  @IsEthereumAddress()
  @Length(2, 255)
  readonly address: string;

  @IsNumber()
  readonly floorPrice: number;

  @IsNumber()
  readonly oneDayVolume: number;
  @IsNumber()
  readonly sevenDayVolume: number;
  @IsNumber()
  readonly thirtyDayVolume: number;
  @IsNumber()
  readonly totalVolume: number;

  @IsNumber()
  readonly oneDaySales: number;
  @IsNumber()
  readonly sevenDaySales: number;
  @IsNumber()
  readonly thirtyDaySales: number;
  @IsNumber()
  readonly totalSales: number;

  @IsNumber()
  readonly oneDayAveragePrice: number;
  @IsNumber()
  readonly sevenDayAveragePrice: number;
  @IsNumber()
  readonly thirtyDayAveragePrice: number;
  @IsNumber()
  readonly averagePrice: number;

  @IsNumber()
  readonly numOwners: number;
  @IsNumber()
  readonly marketCap: number;

  @IsDate()
  readonly timeAt: Date;

  static readonly logger = new Logger(ContractState.name);
  constructor({
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
  }) {
    this.address = address;
    this.floorPrice = floorPrice;
    this.oneDaySales = oneDaySales;
    this.sevenDaySales = sevenDaySales;
    this.thirtyDaySales = thirtyDaySales;
    this.totalSales = totalSales;
    this.oneDayAveragePrice = oneDayAveragePrice;
    this.sevenDayAveragePrice = sevenDayAveragePrice;
    this.thirtyDayAveragePrice = thirtyDayAveragePrice;
    this.averagePrice = averagePrice;
    this.oneDayVolume = oneDayVolume;
    this.sevenDayVolume = sevenDayVolume;
    this.thirtyDayVolume = thirtyDayVolume;
    this.totalVolume = totalVolume;
    this.numOwners = numOwners;
    this.marketCap = marketCap;
    this.timeAt = timeAt;
  }

  public static async create(
    props: ContractStateProps,
  ): Promise<Result<ContractState>> {
    this.logger.log(`create ContractStateProps ${JSON.stringify(props)}`);

    const contractState = new ContractState(props);
    this.logger.log(`create Contract ${JSON.stringify(contractState)}`);

    const errors = await validate(contractState);

    if (errors.length > 0) {
      return Result.fail<ContractState>(
        Object.values(errors[0].constraints)[0],
      );
    }

    return Result.ok<ContractState>(contractState);
  }
}
