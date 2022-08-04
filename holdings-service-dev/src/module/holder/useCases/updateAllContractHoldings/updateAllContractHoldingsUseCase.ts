import { Inject, Injectable, Logger } from '@nestjs/common';
import { Contract } from 'src/module/contract/domain/contract';
import { GetAllContractsUseCase } from 'src/module/contract/useCases/getAllContracts/getAllContractsUseCase';
import { UpdateContractUseCase } from 'src/module/contract/useCases/updateContract/updateContractUseCase';
import { WEB3_SERVICE, Web3Service } from 'src/module/web3/Web3Service';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { HolderMapper } from '../../holder.mapper';
import { HOLDER_REPO, HolderRepo } from '../../repos/holder.repo';

type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<void>
>;

@Injectable()
export class UpdateAllContractHoldingsUseCase {
  private readonly logger = new Logger(UpdateAllContractHoldingsUseCase.name);
  constructor(
    private getAllContractsUseCase: GetAllContractsUseCase,
    private updateContractUseCase: UpdateContractUseCase,
    @Inject(WEB3_SERVICE) private web3Service: Web3Service,
    @Inject(HOLDER_REPO) private holderRepo: HolderRepo,
  ) {}

  public async getAllReadyToTrackContracts() {
    try {
      const contractsOrError = await this.getAllContractsUseCase.exec({
        isReadyToUpdate: true,
        featureKeys: ['wallet_tracking'],
      });

      if (contractsOrError.isLeft()) {
        const error = contractsOrError.value;
        this.logger.error(
          `getAllReadyContracts getAllContracts error ${JSON.stringify(error)}`,
        );
        throw new Error(
          `getAllReadyContracts getAllContracts error ${JSON.stringify(error)}`,
        );
      }

      const contracts = contractsOrError.value.getValue();
      return contracts;
    } catch (e) {
      throw new Error(`${e.message}`);
    }
  }

  public async exec(contracts: Contract[]): Promise<Response> {
    try {
      this.logger.log(
        `UpdateAllContractHoldings all ready contracts ${JSON.stringify(
          contracts,
        )}`,
      );

      await Promise.all(contracts.map(this.syncContractHoldings));
      this.logger.log(`UpdateAllContractHoldings updated`);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }

  private syncContractHoldings = async (contract: Contract) => {
    const { blockNumber, signatures, address } = contract;

    const updateResOrError = await this.updateContractUseCase.exec({
      address,
      status: 'UPDATING',
    });

    if (updateResOrError.isLeft()) {
      const error = updateResOrError.value;
      this.logger.error(
        `syncContractHoldings updateContract start error ${JSON.stringify(
          error,
        )}`,
      );

      throw new Error(
        `syncContractHoldings updateContract start error ${JSON.stringify(
          error,
        )}`,
      );
    }
    const currentBlock = await this.web3Service.getCurrentBlock();
    await this.savePastLogs(blockNumber, currentBlock, address, signatures);

    const responseOrError = await this.updateContractUseCase.exec({
      address,
      status: 'READY',
      blockNumber: currentBlock,
    });

    if (responseOrError.isLeft()) {
      const error = responseOrError.value;
      this.logger.error(
        `syncContractHoldings updateContract end error ${JSON.stringify(
          error,
        )}`,
      );

      throw new Error(
        `syncContractHoldings updateContract end error ${JSON.stringify(
          error,
        )}`,
      );
    }
    this.logger.log(`UpdateAllContractHoldings saved`);
  };

  public async savePastLogs(
    fromBlock: number,
    toBlock: number,
    contractAddress: string,
    funcSignatures: string[],
  ) {
    if (fromBlock <= toBlock) {
      try {
        this.logger.log(
          `savePastLogs getting past logs... from: ${fromBlock} to: ${toBlock}`,
        );

        const logs = await this.web3Service.getPastLogs(fromBlock, toBlock, {
          topics: [funcSignatures],
          address: contractAddress,
        });
        this.logger.log(`logs length ${logs.length}`);

        const required = [];
        for (const log of logs) {
          const { topics, address, data } = log;
          const functionSerializer = HolderMapper.createSerializer(topics[0]);

          const serialized = functionSerializer({ topics, address, data });

          const holder = await HolderMapper.toDomain({
            address: (
              (await this.web3Service.decodeParameter(
                'address',
                serialized.address,
              )) as string
            ).toLowerCase(),
            tokenId: (
              await this.web3Service.hexToNumber(serialized.tokenId)
            ).toString(),
            contractAddress: serialized.contractAddress.toLowerCase(),
          });

          if (holder.address !== '0x0000000000000000000000000000000000000000') {
            required.push(holder);
          }
        }
        this.logger.log(
          `savePastLogs required logs length ${required.length} `,
        );

        const batch = 1000;

        let head = 0;

        for (let j = 0; j < Math.ceil(required.length / batch); j++) {
          this.logger.log(`savePastLogs batch ${j} `);
          const toSend = required.slice(head, batch + head);
          await this.holderRepo.upsertHoldings(toSend);
          head += batch;
        }
      } catch (error) {
        const midBlock = (fromBlock + toBlock) >> 1;
        await this.savePastLogs(
          fromBlock,
          midBlock,
          contractAddress,
          funcSignatures,
        );
        await this.savePastLogs(
          midBlock + 1,
          toBlock,
          contractAddress,
          funcSignatures,
        );
      }
    }
  }
}
