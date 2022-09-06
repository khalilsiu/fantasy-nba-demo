import {
  snakeCase,
  camelCase,
  isDate,
  isObject,
  isArray,
  transform,
} from 'lodash';

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

export const throttlePromises = async <T>(inputPromises: Promise<T>[]) => {
  let tempPromises = [];
  const results = [];
  for (let i = 0; i < inputPromises.length; i++) {
    if (i % 2 === 0) {
      const result = await Promise.all(tempPromises);
      results.push(...result);
      tempPromises = [];
      sleep(200);
      console.log('sleep 200ms');
    } else {
      tempPromises.push(inputPromises[i]);
    }
  }
  return results;
};
