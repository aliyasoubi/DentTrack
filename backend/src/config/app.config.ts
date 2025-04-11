import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Server Configuration
  port: parseInt(process.env.PORT || '', 10) || 3000,
  host: process.env.HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // API Configuration
  api: {
    prefix: process.env.API_PREFIX || 'api',
    version: process.env.API_VERSION || 'v1',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  },
  
  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/denttrack',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  
  // Swagger Configuration
  swagger: {
    title: process.env.SWAGGER_TITLE || 'DentTrack API',
    description: process.env.SWAGGER_DESCRIPTION || 'Dental inventory management system API',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api',
  },
  
  // Security Configuration
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  
  // Validation Configuration
  validation: {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    dateFormat: 'YYYY-MM-DD',
    timezone: process.env.TZ || 'UTC',
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'json',
  },
})); 