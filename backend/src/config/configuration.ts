export default () => ({
  port: parseInt(process.env.PORT || '', 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/denttrack',
  },
  api: {
    prefix: process.env.API_PREFIX || 'api',
    version: process.env.API_VERSION || 'v1',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'DentTrack API',
    description: process.env.SWAGGER_DESCRIPTION || 'Dental Inventory Management System API',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
}); 