import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { InventoryModule } from './inventory/inventory.module';
import appConfig from './config/app.config';
import { LoggerService } from './utils/logger.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    
    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('app.database.uri'),
        ...configService.get('app.database.options'),
      }),
      inject: [ConfigService],
    }),
    
    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests per minute
    }]),
    
    // Feature Modules
    InventoryModule,
  ],
  providers: [LoggerService],
})
export class AppModule {} 