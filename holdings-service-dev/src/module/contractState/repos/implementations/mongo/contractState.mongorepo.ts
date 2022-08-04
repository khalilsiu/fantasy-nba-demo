import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContractState,
  ContractStateProps,
} from 'src/module/contractState/domain/contractState';
import {
  ContractStateMapper,
  ContractStateRepo,
} from '../../contractState.repo';

import { ContractStateDocument } from './schemas/contractState.schema';

@Injectable()
export class MongoContractStateRepo implements ContractStateRepo {
  private readonly logger = new Logger(MongoContractStateRepo.name);

  constructor(
    @InjectModel(ContractState.name)
    private contractStateModel: Model<ContractStateDocument>,
  ) {}

  async upsertContractState(contractState: ContractState): Promise<void> {
    this.logger.log( 
      `upsertContractState contractState ${JSON.stringify(contractState)}`,
    );
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

    this.logger.log( 
      `upsertContractState contractState ${JSON.stringify({
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
      })}`,
    );

    const doc = new this.contractStateModel({
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
    });

    await doc.save();
  }

  async getContractState(address: string): Promise<ContractState | null> {
    this.logger.log(`getContractState address ${address}`);

    const contractState = await this.contractStateModel
      .findOne({ address })
      .sort({ _id: -1 });

    if (!contractState) {
      return null;
    }

    this.logger.log( 
      `getContractState contractState ${JSON.stringify(contractState)}`,
    );

    return ContractStateMapper.toDomain(contractState);
  }

  async getAllContractState(): Promise<ContractStateProps[]> {
    this.logger.log(`getContractState`);

    const aggregated = await this.contractStateModel.aggregate([
      { $sort: { _id: -1 } },
      {
        $group: {
          _id: '$address',
          doc: { $first: '$$ROOT' },
        },
      },
    ]);

    const contractStatesDoc = aggregated.map((elem) => elem.doc);

    this.logger.log( 
      `getContractState contractState ${JSON.stringify(contractStatesDoc)}`,
    );

    return contractStatesDoc;
  }

  async getHistoricalState(
    address: string,
    page: number,
  ): Promise<ContractState[]> {
    const entryPerPage = 300;
    this.logger.log(`getHistoricalState address ${address}`);

    const contractStates = await this.contractStateModel
      .find({ address }, null, {
        limit: entryPerPage,
        skip: (page - 1) * entryPerPage,
      })
      .sort({ _id: -1 });

    this.logger.log( 
      `getHistoricalState contractState ${JSON.stringify(contractStates)}`,
    );

    return Promise.all(
      contractStates.map((state) => ContractStateMapper.toDomain(state)),
    );
  }
}
