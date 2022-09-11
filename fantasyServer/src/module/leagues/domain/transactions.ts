import { Logger } from '@nestjs/common';
import { IsNumber, validate, ValidateNested, IsArray } from 'class-validator';
import { Result } from 'src/shared/core/Result';
import { Type } from 'class-transformer';

export interface TransactionProps {
  leagueId: number;
  teamId1: number;
  playerIds1: number[];
  teamId2: number;
  playerIds2: number[];
}

export class Transaction {
  @IsNumber()
  readonly leagueId: number;

  @IsNumber()
  readonly teamId1: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Number)
  readonly playerIds1: number[];

  @IsNumber()
  readonly teamId2: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Number)
  readonly playerIds2: number[];

  static readonly logger = new Logger(Transaction.name);
  constructor({
    leagueId,
    teamId1,
    playerIds1,
    teamId2,
    playerIds2,
  }: TransactionProps) {
    this.leagueId = leagueId;
    this.teamId1 = teamId1;
    this.playerIds1 = playerIds1;
    this.teamId2 = teamId2;
    this.playerIds2 = playerIds2;
  }

  public static async create(
    props: TransactionProps,
  ): Promise<Result<Transaction>> {
    this.logger.log(`create transaction`);

    const transaction = new Transaction(props);
    const errors = await validate(transaction);
    this.logger.log(`validated create transaction`);

    if (errors.length > 0) {
      return Result.fail<Transaction>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Transaction>(transaction);
  }
}
