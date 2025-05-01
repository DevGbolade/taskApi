import { DataSource } from 'typeorm';
import 'dotenv/config';
import { config } from './config';
import Logger from 'bunyan';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const log: Logger = config.createLogger('Database');

const entitiesPath = isProduction
  ? path.join(__dirname, '..', 'entities', '*.js')
  : path.join(__dirname, '..', '..', 'src', 'entities', '*.ts');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [entitiesPath],
  synchronize: true,
  uuidExtension: 'uuid-ossp',
  logging: !isProduction,
});

export const startDatabase = async () => {
  try {
    await AppDataSource.initialize();
    log.info('✅ Database connected successfully');
  } catch (error) {
    log.error('❌ Database connection error:', error);
  }
};
