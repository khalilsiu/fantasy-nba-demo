import { Holder, HolderProps } from '../domain/holder';

export const HOLDER_REPO = 'HOLDER REPO';

export interface HolderRepo {
  upsertHoldings(holders: Holder[]): Promise<void>;
  findHoldingsByTokenId(tokenIds: string[]): Promise<Holder[]>;
  getHoldings(contractAddress?: string): Promise<HolderProps[]>;
}
