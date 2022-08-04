import { ComparisonOperators } from 'src/shared/mongo/interfaces';
import { Lease, LeaseStatus } from '../domain/lease';
import { GetLeaseSort } from '../useCases/getLeases/getLeasesByFilterDTO';

export const LEASE_REPO = 'LEASE REPO';

export interface ILeaseFindOptions {
  sort: GetLeaseSort[];
}

export interface ComparativeValue {
  value: number;
  operator: ComparisonOperators;
}
export interface ILeaseFind {
  lessor?: string;
  lessee?: string;
  tokenIds?: string[];
  status?: LeaseStatus;
  finalLeaseLength?: ComparativeValue;
  isRentOverdue?: boolean;
  tokenId?: string;
}
export interface LeaseRepo {
  upsertLease(
    contractAddress: string,
    tokenId: string,
    lease: Partial<Lease>,
  ): Promise<Lease>;
  updateLease(
    contractAddress: string,
    filter: ILeaseFind,
    leaseDetails: Partial<Lease>,
  ): Promise<Lease>;
  find(
    contractAddress: string,
    filter: ILeaseFind,
    options?: ILeaseFindOptions,
  ): Promise<Lease[]>;
}
