import { Logger } from '@nestjs/common';
import { Contract } from './domain/contract';

export class ContractMapper {
  static readonly logger = new Logger(ContractMapper.name);

  static async toDomain({
    address,
    status,
    blockNumber,
    signatures,
    featureKeys,
    botConfig,
  }: any): Promise<Contract> {
    const contractOrError = await Contract.create({
      address,
      status,
      blockNumber,
      signatures,
      featureKeys,
      botConfig,
    });
    this.logger.log(
      `toDomain contractOrError ${JSON.stringify(contractOrError)}`,
    );

    if (contractOrError.isFailure) {
      throw new Error('ContractMapper map to domain failed.');
    }
    return contractOrError.getValue();
  }

  static toDTO(contract: Contract) {
    const { address, blockNumber, status, signatures, featureKeys, botConfig } =
      contract;
    return {
      address,
      block_number: blockNumber,
      status,
      signatures,
      feature_keys: featureKeys,
      bot_config: botConfig,
    };
  }
}
