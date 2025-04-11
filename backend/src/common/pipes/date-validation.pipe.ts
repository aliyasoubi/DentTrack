import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`${metadata.data} must be a valid ISO 8601 date`);
    }

    return date;
  }
} 