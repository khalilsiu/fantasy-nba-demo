import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Holder, HolderProps } from '../../../domain/holder';

import { HolderDocument } from './schemas/holder.schema';
import { HolderRepo } from '../../holder.repo';
import { HolderMapper } from 'src/module/holder/holder.mapper';

@Injectable()
export class MongoHolderRepo implements HolderRepo {
  private readonly logger = new Logger(MongoHolderRepo.name);

  constructor(
    @InjectModel(Holder.name) private holderModel: Model<HolderDocument>,
  ) {}

  async upsertHoldings(holders: Holder[]): Promise<void> {
    this.logger.log(`upsertHoldings holders ${JSON.stringify(holders)}`);
    const bulkOps = holders.map(({ tokenId, address, contractAddress }) => ({
      updateOne: {
        filter: { tokenId, contractAddress },
        update: {
          $set: {
            address,
          },
        },
        upsert: true,
      },
    }));

    await this.holderModel.bulkWrite(bulkOps);
  }

  async findHoldingsByTokenId(tokenIds: string[]): Promise<Holder[]> {
    this.logger.log(
      `findHoldersByTokenIds tokenIds ${JSON.stringify(tokenIds)}`,
    );

    const holdersDoc = await this.holderModel.find({
      tokenId: { $in: tokenIds },
    });
    return Promise.all(
      holdersDoc.map((holder) => HolderMapper.toDomain(holder.toObject())),
    );
  }

  // use holder props to reduce the time to revalidate
  async getHoldings(contractAddress?: string): Promise<HolderProps[]> {
    this.logger.log(`getHoldings`);
    const query = { ...(contractAddress && { contractAddress }) };
    const holdersDoc = await this.holderModel.find(query);
    return holdersDoc.map((holderDoc) => {
      const holder = holderDoc.toObject();
      return holder;
    });
  }
}
