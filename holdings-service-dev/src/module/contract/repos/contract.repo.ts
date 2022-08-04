import { Logger } from '@nestjs/common';
import { Contract, ContractProps } from '../domain/contract';

export const CONTRACT_REPO = 'CONTRACT REPO';

export interface ContractRepo {
  createContract(contract: Contract): Promise<Contract>;
  updateContract(contractProps: Partial<ContractProps>): Promise<Contract>;
  getContract(address: string): Promise<Contract>;
  getAllContracts(
    isReadyToUpdate?: boolean,
    featureKeys?: string[],
  ): Promise<Contract[]>;
}
