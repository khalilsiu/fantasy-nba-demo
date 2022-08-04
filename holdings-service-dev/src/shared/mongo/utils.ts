import { ComparisonOperators } from './interfaces';

export default class MongoUtils {
  static comparativeQueryBuilder(data, operator: ComparisonOperators) {
    switch (operator) {
      case ComparisonOperators['>']: {
        return { $gt: data };
      }
      case ComparisonOperators['<']: {
        return { $lt: data };
      }
      case ComparisonOperators['>=']: {
        return { $gte: data };
      }
      case ComparisonOperators['<=']: {
        return { $lte: data };
      }
      case ComparisonOperators['!=']: {
        return { $ne: data };
      }
      case ComparisonOperators['in']: {
        return { $in: data };
      }
      case ComparisonOperators['!in']: {
        return { $nin: data };
      }
      default: {
        return data;
      }
    }
  }
}
