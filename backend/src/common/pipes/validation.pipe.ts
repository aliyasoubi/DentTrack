import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): any[] {
    return errors.map(error => {
      const formattedError: any = {
        field: error.property,
        value: error.value,
        constraints: {},
      };

      if (error.constraints) {
        Object.keys(error.constraints).forEach(key => {
          formattedError.constraints[key] = error.constraints[key];
        });
      }

      if (error.children && error.children.length > 0) {
        formattedError.children = this.formatErrors(error.children);
      }

      return formattedError;
    });
  }
} 