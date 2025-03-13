import { DataSource } from 'typeorm';
import 'dotenv/config';
import { config } from './config';
import Logger from 'bunyan';
const isProduction = process.env.NODE_ENV === 'production';
const log: Logger = config.createLogger("Database");

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: isProduction 
    ? [__dirname + '/../entities/*.js']  
    : ['src/entities/*.ts'],
    synchronize: true,
    uuidExtension: 'uuid-ossp',
    logging: !isProduction,
});

export const startDatabase = async () => {
    AppDataSource.initialize()
    .then(() => {
        log.info('✅ Database connected successfully');
    })
    .catch(error => log.error('❌ Database connection error:', error));
}       