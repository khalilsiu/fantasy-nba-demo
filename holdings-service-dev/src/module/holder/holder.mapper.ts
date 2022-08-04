import { Logger } from '@nestjs/common';
import { Holder } from './domain/holder';

type Serializer = ({
  topics,
  address,
  data,
}: {
  topics: string[];
  address: string;
  data: string;
}) => { address: string; tokenId: string; contractAddress: string };

export class HolderMapper {
  static readonly logger = new Logger(HolderMapper.name);

  static async toDomain(doc: any): Promise<Holder> {
    const userOrError = await Holder.create({
      address: doc.address,
      tokenId: doc.tokenId,
      contractAddress: doc.contractAddress,
    });
    this.logger.log(`toDomain userOrError ${JSON.stringify(userOrError)}`);

    if (userOrError.isFailure) {
      throw new Error('GetUserByIdMapper map to domain failed.');
    }
    return userOrError.getValue();
  }

  static toDTO(holder: Holder) {
    const { address, contractAddress, tokenId } = holder;
    return {
      address,
      contractAddress,
      tokenId,
    };
  }

  static createSerializer(signature: string): Serializer {
    switch (signature) {
      case '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': {
        return ({ topics, address }) => ({
          address: topics[2],
          tokenId: topics[3],
          contractAddress: address,
        });
      }
      case '0x58e5d5a525e3b40bc15abaa38b5882678db1ee68befd2f60bafe3a7fd06db9e3': {
        return ({ topics, address }) => ({
          address: topics[3],
          tokenId: topics[1],
          contractAddress: address,
        });
      }
      case '0x05af636b70da6819000c49f85b21fa82081c632069bb626f30932034099107d8': {
        return ({ topics, address, data }) => ({
          address: topics[2],
          tokenId: data,
          contractAddress: address,
        });
      }
      default:
        throw new Error('Function signature is not available');
    }
  }
}
