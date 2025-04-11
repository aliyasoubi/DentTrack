import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(private configService: ConfigService) {}

  setContext(context: string) {
    this.context = context;
  }

  private formatMessage(message: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    return `[${timestamp}] [${ctx}] ${message}`;
  }

  log(message: any, context?: string) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage(message, context));
    }
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage(message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message, context));
    }
  }

  debug(message: any, context?: string) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message, context));
    }
  }

  verbose(message: any, context?: string) {
    if (this.shouldLog('verbose')) {
      console.log(this.formatMessage(message, context));
    }
  }

  private shouldLog(level: string): boolean {
    const configuredLevel = this.configService.get<string>('app.logging.level') || 'debug';
    const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
    return levels.indexOf(level) <= levels.indexOf(configuredLevel);
  }
} 