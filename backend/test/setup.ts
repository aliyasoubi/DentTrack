import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

// Disable logging during tests
Logger.overrideLogger(['error', 'warn']);

// Increase timeout for tests
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/denttrack-test';

@Injectable()
export class YourService {
  constructor(private configService: ConfigService) {
    const port = this.configService.get<number>('app.port');
    const dbUri = this.configService.get<string>('app.database.uri');
  }
} 