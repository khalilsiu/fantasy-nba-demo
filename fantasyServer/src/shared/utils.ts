import {
  snakeCase,
  camelCase,
  isDate,
  isObject,
  isArray,
  transform,
} from 'lodash';
import { Types } from 'mongoose';

export const camelize = (obj: any) =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);
    if (isDate(value)) {
      acc[camelKey] = value;
    } else if (isObject(value)) {
      acc[camelKey] = camelize(value);
    } else {
      acc[camelKey] = value;
    }
  });

export const snakeize = (obj: any) =>
  transform(obj, (acc, value, key, target) => {
    const snakeKey = isArray(target) ? key : snakeCase(key);
    if (isDate(value)) {
      acc[snakeKey] = value;
    } else if (isObject(value)) {
      acc[snakeKey] = snakeize(value);
    } else {
      acc[snakeKey] = value;
    }
  });

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const throttlePromises = async <T>(
  inputPromise: Promise<T>,
  index: number,
  length: number,
  outputPromises: Promise<T>[],
): Promise<{ result: T[]; outputPromises: Promise<T>[] }> => {
  outputPromises.push(inputPromise);
  if (index % 5 === 0 || index === length - 1) {
    const result = await Promise.all(outputPromises);
    console.log('sleep for 1000ms');
    await sleep(1000);

    return { result, outputPromises: [] };
  }
  return { result: [], outputPromises };
};

export const generateMongooseId = (id?: string) => {
  return Types.ObjectId(id).toHexString();
};
