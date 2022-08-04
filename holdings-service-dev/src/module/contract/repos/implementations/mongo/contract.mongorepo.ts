import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BotConfig, Contract, ContractProps } from '../../../domain/contract';

import { BotConfigDocument, ContractDocument } from './schemas/contract.schema';
import { ContractRepo } from '../../contract.repo';
import { ContractMapper } from 'src/module/contract/contract.mapper';

@Injectable()
export class MongoContractRepo implements ContractRepo {
  private readonly logger = new Logger(MongoContractRepo.name);

  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(BotConfig.name)
    private botConfigModel: Model<BotConfigDocument>,
  ) {}

  async createContract(contract: Contract): Promise<Contract> {
    this.logger.log(`createContract contract ${JSON.stringify(contract)}`);
    const { address, status, blockNumber, signatures, featureKeys, botConfig } =
      contract;
    const contractDoc = new this.contractModel({
      address,
      status,
      blockNumber,
      signatures,
      featureKeys,
      botConfig,
    });
    const saved = await contractDoc.save();
    this.logger.log(`createContract contract saved ${JSON.stringify(saved)}`);

    return ContractMapper.toDomain(saved.toObject());
  }

  async updateContract(
    contractProps: Partial<ContractProps>,
  ): Promise<Contract> {
    this.logger.log(
      `updateContract contract props ${JSON.stringify(contractProps)}`,
    );
    const { address, status, blockNumber, signatures, featureKeys, botConfig } =
      contractProps;

    const toUpdate = {
      ...(status && { status }),
      ...(blockNumber && { blockNumber }),
      ...(signatures && { signatures }),
      ...(featureKeys && { featureKeys }),
      ...(botConfig && {
        botConfig: botConfig.map((config) => new this.botConfigModel(config)),
      }),
    };
    await this.contractModel.findOneAndUpdate({ address }, { $set: toUpdate });
    const contract = await this.contractModel.findOne({ address });
    return ContractMapper.toDomain(contract.toObject());
  }

  async getContract(address: string): Promise<Contract> {
    this.logger.log(`getContract address ${JSON.stringify(address)}`);

    const query = {
      address,
    };
    const contract = await this.contractModel.findOne(query);
    return contract ? ContractMapper.toDomain(contract) : null;
  }

  async getAllContracts(
    isReadyToUpdate?: boolean,
    featureKeys?: string[],
  ): Promise<Contract[]> {
    this.logger.log(`getContracts`);

    const query = {
      ...(isReadyToUpdate && {
        status: 'READY',
        signatures: { $exists: true, $ne: [] },
      }),
      ...(featureKeys && { featureKeys: { $in: featureKeys } }),
    };
    const contracts = await this.contractModel.find(query);
    return Promise.all(
      contracts.map((contract) => ContractMapper.toDomain(contract)),
    );
  }
}
