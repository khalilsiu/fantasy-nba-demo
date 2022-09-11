import { BadRequestException } from '@nestjs/common';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
// import { camelize } from './utils';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // incoming validations are being transformed to camelcase
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException(`Validation pipe failed. Error: ${errors}`);
    }
    return object;
  }

  private toValidate(metatype: any) {
    const types = [String, Number, Array, Object, Boolean];
    return !types.includes(metatype);
  }
}
