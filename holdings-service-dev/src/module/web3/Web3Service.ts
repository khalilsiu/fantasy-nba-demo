import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

export const WEB3_SERVICE = 'WEB3 SERVICE';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private web3http: any;
  private web3: any;
  constructor() {
    const domain = 'mainnet.infura.io/v3';
    this.web3http = new Web3(
      new Web3.providers.HttpProvider(
        `https://${domain}/${process.env.INFURA_KEY}`,
      ),
    );
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        `wss://${domain}/${process.env.INFURA_KEY}`,
      ),
    );
  }
  public async decodeParameter(
    type: string,
    hex: string,
  ): Promise<string | { [key: string]: any }> {
    return this.web3http.eth.abi.decodeParameter(type, hex);
  }

  public async hexToNumber(hex: string) {
    return this.web3http.utils.hexToNumber(hex);
  }

  public async getPastLogs(fromBlock: number, toBlock: number, options: any) {
    return this.web3http.eth.getPastLogs({ fromBlock, toBlock, ...options });
  }

  public async getCurrentBlock() {
    return this.web3http.eth.getBlockNumber();
  }
}
