import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Lease, LeaseStatus } from '../../../domain/lease';
import {
  ComparativeValue,
  ILeaseFind,
  ILeaseFindOptions,
  LeaseRepo,
} from '../../lease.repo';
import { LeaseMapper } from 'src/module/lease/lease.mapper';
import { LeaseDocument } from './schemas/lease.schema';
import MongoUtils from 'src/shared/mongo/utils';

@Injectable()
export class MongoLeaseRepo implements LeaseRepo {
  private readonly logger = new Logger(MongoLeaseRepo.name);

  constructor(
    @InjectModel(Lease.name) private leaseModel: Model<LeaseDocument>,
  ) {}

  async upsertLease(
    contractAddress: string,
    tokenId: string,
    lease: Partial<Lease>,
  ): Promise<Lease> {
    this.logger.log(`upsert lease ${JSON.stringify(lease)}`);
    const leaseObj = await this.leaseModel.findOneAndUpdate(
      // only open contracts can be updated, otherwise insert
      { tokenId, contractAddress, status: LeaseStatus['OPEN'] },
      {
        $set: { ...lease, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );
    return LeaseMapper.toDomain(leaseObj.toObject());
  }

  async updateLease(
    contractAddress: string,
    { tokenId, status }: ILeaseFind,
    leaseDetails: Partial<Lease>,
  ): Promise<Lease> {
    this.logger.log(`update lease ${JSON.stringify(leaseDetails)}`);
    const query = this.queryBuilder({ contractAddress, tokenId, status });
    const leaseObj = await this.leaseModel.findOneAndUpdate(
      query,
      {
        $set: {
          ...leaseDetails,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    if (!leaseObj) {
      return null;
    }
    return LeaseMapper.toDomain(leaseObj.toObject());
  }

  async find(
    contractAddress: string,
    {
      lessor,
      lessee,
      tokenIds,
      status,
      finalLeaseLength,
      isRentOverdue,
    }: ILeaseFind,
    options: ILeaseFindOptions,
  ) {
    this.logger.log(`find leases`);

    const query: FilterQuery<LeaseDocument> = this.queryBuilder({
      contractAddress,
      lessor,
      lessee,
      tokenIds,
      status,
      finalLeaseLength,
      isRentOverdue,
    });
    let ops = this.leaseModel.find(query);

    if (options.sort) {
      const sort = options.sort.reduce((acc, sortElem) => {
        let orderBy = 1;
        if (sortElem.order === 'desc') {
          orderBy = -1;
        }
        return {
          ...acc,
          [sortElem.field]: orderBy,
        };
      }, {});

      ops = ops.sort(sort);
    }

    this.logger.log(`find leases query ${JSON.stringify(query)}`);
    const leases = await ops;
    return Promise.all(
      leases.map((lease) => LeaseMapper.toDomain(lease.toObject())),
    );
  }

  queryBuilder({
    contractAddress,
    lessor,
    lessee,
    tokenIds,
    status,
    finalLeaseLength,
    isRentOverdue,
  }: ILeaseFind & { contractAddress: string }) {
    const query: FilterQuery<LeaseDocument> = { contractAddress };

    this.buildLessorQuery(query, lessor);

    this.buildLesseeQuery(query, lessee);

    this.buildTokenIdsQuery(query, tokenIds);

    this.buildStatusQuery(query, status);

    this.buildRentOverdueQuery(query, isRentOverdue);

    this.buildFinalLeaseLengthQuery(query, finalLeaseLength);

    return query;
  }

  private buildFinalLeaseLengthQuery(
    query: FilterQuery<LeaseDocument>,
    finalLeaseLength: ComparativeValue,
  ) {
    if (finalLeaseLength) {
      query.finalLeaseLength = MongoUtils.comparativeQueryBuilder(
        finalLeaseLength.value,
        finalLeaseLength.operator,
      );
    }
  }

  private buildLessorQuery(query: FilterQuery<LeaseDocument>, lessor: string) {
    if (lessor) {
      query.lessor = lessor;
    }
  }

  private buildLesseeQuery(query: FilterQuery<LeaseDocument>, lessee: string) {
    if (lessee) {
      query.lessee = lessee;
    }
  }

  private buildTokenIdsQuery(
    query: FilterQuery<LeaseDocument>,
    tokenIds: string[],
  ) {
    if (tokenIds) {
      query.tokenId = { $in: tokenIds };
    }
  }

  private buildRentOverdueQuery(
    query: FilterQuery<LeaseDocument>,
    isRentOverdue: boolean,
  ) {
    if (isRentOverdue !== undefined) {
      query.status = LeaseStatus['LEASED'];
      query['$and'] = [
        ...(query['$and'] || []),
        {
          $expr: this.buildRentOverDueQuery(isRentOverdue),
        },
      ];
    }
  }

  private buildStatusQuery(
    query: FilterQuery<LeaseDocument>,
    status?: LeaseStatus,
  ) {
    if (status) {
      query.status = status;
      let leaseCompleteQuery;
      if (status === LeaseStatus['COMPLETED']) {
        query.status = LeaseStatus['LEASED'];
        leaseCompleteQuery = this.buildLeaseCompleteQuery(true);
        query['$and'] = [{ $expr: leaseCompleteQuery }];
      } else if (status === LeaseStatus['LEASED']) {
        leaseCompleteQuery = this.buildLeaseCompleteQuery(false);
        query['$and'] = [{ $expr: leaseCompleteQuery }];
      }
    }
  }

  private buildRentOverDueQuery(isRentOverdue: boolean) {
    const now = new Date();
    const query = {
      $dateAdd: {
        startDate: {
          $dateAdd: {
            startDate: '$dateSigned',
            unit: 'month',
            amount: '$monthsPaid',
          },
        },
        unit: 'day',
        amount: '$gracePeriod',
      },
    };
    const comparativeQuery = [now, query];
    if (isRentOverdue) {
      return {
        $gt: comparativeQuery,
      };
    }
    return { $lte: comparativeQuery };
  }

  private buildLeaseCompleteQuery(isCompleted: boolean) {
    const now = new Date();
    const query = {
      $dateAdd: {
        startDate: '$dateSigned',
        unit: 'month',
        amount: '$finalLeaseLength',
      },
    };
    const comparativeQuery = [now, query];
    if (isCompleted) {
      return {
        $gte: comparativeQuery,
      };
    }
    return { $lt: comparativeQuery };
  }
}
