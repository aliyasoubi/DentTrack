import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggerService } from './utils/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // Set up global logger
  app.useLogger(logger);

  // Enable CORS with configuration
  app.enableCors(configService.get('app.security.cors'));

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(logger),
  );

  // Global validation pipe with proper configuration
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(configService.get('app.swagger.title') || 'DentTrack API')
    .setDescription(configService.get('app.swagger.description') || 'Dental inventory management system API')
    .setVersion(configService.get('app.swagger.version') || '1.0')
    .addBearerAuth()
    .addTag('inventory', 'Inventory management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('app.swagger.path') || 'api', app, document);

  const port = configService.get('app.port') || 3000;
  const host = configService.get('app.host') || '0.0.0.0';
  
  await app.listen(port, host);
  logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap(); 