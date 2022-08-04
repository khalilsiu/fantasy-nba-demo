import { Logger } from '@nestjs/common';
import {
  IsEnum,
  IsEthereumAddress,
  IsNumber,
  IsString,
  IsDate,
  validate,
  IsPositive,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { addDays, addMonths } from 'date-fns';
import { ObjectId } from 'mongoose';
import { Result } from 'src/shared/core/Result';
import {
  IsInRange,
  IsBiggerThanOrEqualTo,
  IsSmallerThanOrEqualTo,
} from 'src/shared/customDecorators';
import { AcceptedTokens } from '../constants/AcceptedToken';

export enum LeaseStatus {
  OPEN = 'OPEN',
  LEASED = 'LEASED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface LeaseProps {
  _id: ObjectId;
  rentAmount: number;
  deposit: number;
  monthsPaid: number;
  gracePeriod: number;
  minLeaseLength: number;
  maxLeaseLength: number;
  rentToken: AcceptedTokens;
  status: LeaseStatus;
  autoRegenerate: boolean;
  lessor: string;
  lessee: string;
  tokenId: string;
  contractAddress: string;
  createdAt: Date;
  updatedAt: Date;
  finalLeaseLength?: number;
  dateSigned?: Date;
  isRentOverdue?: boolean;
}

export class Lease {
  @IsString()
  readonly _id: ObjectId;

  @IsNumber()
  @IsPositive()
  readonly rentAmount: number;

  @IsPositive()
  @IsNumber()
  readonly deposit: number;

  @Min(0)
  @IsNumber()
  readonly monthsPaid: number;

  @IsPositive()
  @IsNumber()
  @Min(7)
  readonly gracePeriod: number;

  @IsNumber()
  @IsPositive()
  @IsSmallerThanOrEqualTo('maxLeaseLength')
  readonly minLeaseLength: number;

  @IsNumber()
  @IsPositive()
  @IsBiggerThanOrEqualTo('minLeaseLength')
  readonly maxLeaseLength: number;

  @IsEnum(AcceptedTokens)
  readonly rentToken: AcceptedTokens;

  @IsEnum(LeaseStatus)
  readonly status: LeaseStatus;

  @IsBoolean()
  readonly autoRegenerate: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isRentOverdue: boolean;

  @IsString()
  @IsEthereumAddress()
  readonly lessor: string;

  @IsString()
  @IsEthereumAddress()
  readonly lessee: string;

  @IsString()
  readonly tokenId: string;

  @IsString()
  @IsEthereumAddress()
  readonly contractAddress: string;

  @IsNumber()
  @IsPositive()
  @IsInRange('minLeaseLength', 'maxLeaseLength')
  @IsOptional()
  readonly finalLeaseLength?: number;

  @IsDate()
  @IsOptional()
  readonly dateSigned?: Date;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsBoolean()
  @IsOptional()
  readonly isRentOverDue?: boolean;

  static readonly logger = new Logger(Lease.name);
  constructor({
    _id,
    rentAmount,
    deposit,
    monthsPaid,
    gracePeriod,
    minLeaseLength,
    maxLeaseLength,
    finalLeaseLength,
    dateSigned,
    rentToken,
    status,
    autoRegenerate,
    lessor,
    lessee,
    tokenId,
    contractAddress,
    createdAt,
    updatedAt,
    isRentOverdue,
  }: LeaseProps) {
    this._id = _id;
    this.rentAmount = rentAmount;
    this.deposit = deposit;
    this.monthsPaid = monthsPaid;
    this.gracePeriod = gracePeriod;
    this.minLeaseLength = minLeaseLength;
    this.maxLeaseLength = maxLeaseLength;
    this.finalLeaseLength = finalLeaseLength;
    this.dateSigned = dateSigned;
    this.rentToken = rentToken;
    this.autoRegenerate = autoRegenerate;
    this.lessor = lessor;
    this.lessee = lessee;
    this.tokenId = tokenId;
    this.contractAddress = contractAddress;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.isRentOverdue = isRentOverdue;
  }

  private static computeRentOverdue = (
    status: LeaseStatus,
    dateSigned: Date,
    monthsPaid: number,
    gracePeriod: number,
  ) => {
    if (
      status === LeaseStatus['LEASED'] ||
      status === LeaseStatus['COMPLETED']
    ) {
      const rentPaidAt = addDays(
        addMonths(dateSigned, monthsPaid),
        gracePeriod,
      );
      let isRentOverdue = false;
      if (new Date() > rentPaidAt) {
        isRentOverdue = true;
      }
      return isRentOverdue;
    }
    return null;
  };

  private static computeLeaseStatus = (
    currentStatus: LeaseStatus,
    dateSigned: Date,
    finalLeaseLength: number,
  ): LeaseStatus => {
    const completedAt = addMonths(dateSigned, finalLeaseLength);
    let computedStatus = currentStatus;
    if (new Date() > completedAt) {
      computedStatus = LeaseStatus['COMPLETED'];
    }
    return computedStatus;
  };

  public static async create(props: LeaseProps): Promise<Result<Lease>> {
    this.logger.log(`create LeaseProps ${JSON.stringify(props)}`);
    const { dateSigned, finalLeaseLength, monthsPaid, gracePeriod } = props;
    const status = this.computeLeaseStatus(
      props.status,
      dateSigned,
      finalLeaseLength,
    );
    const isRentOverdue = this.computeRentOverdue(
      status,
      dateSigned,
      monthsPaid,
      gracePeriod,
    );
    const lease = new Lease({ ...props, status, isRentOverdue });
    this.logger.log(`create Lease ${JSON.stringify(lease)}`);

    const errors = await validate(lease);

    if (errors.length > 0) {
      return Result.fail<Lease>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<Lease>(lease);
  }
}
