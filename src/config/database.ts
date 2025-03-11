import { DataSource } from 'typeorm';
import 'dotenv/config';
import { config } from './config';
import Logger from 'bunyan';
import { User } from '@/entities/user.entity';
import { Task } from '@/entities/task.entity';

const log: Logger = config.createLogger("Database");

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Task],
    synchronize: true,
});

export const startDatabase = async () => {
    AppDataSource.initialize()
    .then(() => {
        log.info('✅ Database connected successfully');
    })
    .catch(error => log.error('❌ Database connection error:', error));
}       