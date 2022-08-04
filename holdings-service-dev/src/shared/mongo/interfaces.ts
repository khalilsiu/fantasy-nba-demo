import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsString,
  IsEthereumAddress,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';

export enum ComparisonOperators {
  '=' = '=',
  '>' = '>',
  '<' = '<',
  '<=' = '<=',
  '>=' = '>=',
  '!=' = '!=',
  'in' = 'in',
  '!in' = '!in',
}

export enum LogicalOperators {
  'and' = 'and',
  'not' = 'not',
  'nor' = 'nor',
  'or' = 'or',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export type Operators = ComparisonOperators | LogicalOperators;

export interface ArrayFilter {
  filters: FilterParam[];
  operator: ComparisonOperators;
}

export interface FilterParam {
  [key: string]: {
    value?: any;
    filters?: FilterParam[];
    operator: Operators;
  };
}

export interface Param {
  value: any;
  operator: ComparisonOperators;
}

export interface Options {
  limit?: number;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  }[];
}

export class OperatorFilter {
  @IsEnum(ComparisonOperators)
  readonly operator: ComparisonOperators;
}

export class AddressFilter extends OperatorFilter {
  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  readonly value: string;
}

export class StringFilter extends OperatorFilter {
  @IsString()
  readonly value: string;
}

export class BooleanFilter extends OperatorFilter {
  @IsBoolean()
  readonly value: string;
}

export class PositiveNumberFilter extends OperatorFilter {
  @IsNumber()
  @IsPositive()
  readonly value: number;
}
