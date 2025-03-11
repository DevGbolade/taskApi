import { AppDataSource } from '../config/database';

import { faker } from '@faker-js/faker';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { hashPassword } from '@/utils/bcrypt.utils';
import Logger from 'bunyan';
import { config } from '@/config/config';
const log: Logger = config.createLogger('seed');

const seedDatabase = async () => {
    await AppDataSource.initialize();
    log.info('✅ Database connected for seeding.');

    const userRepository = AppDataSource.getRepository(User);
    const taskRepository = AppDataSource.getRepository(Task);

    const hashedPassword = await hashPassword('password123');

    const users = [
        userRepository.create({ email: 'admin@example.com', password: hashedPassword, role: 'admin' }),
        userRepository.create({ email: 'user@example.com', password: hashedPassword, role: 'user' }),
    ];

    await userRepository.save(users);
    log.info('✅ Users seeded successfully.');

    const tasks = Array.from({ length: 10 }).map(() =>
        taskRepository.create({
            title: faker.lorem.words(3),
            description: faker.lorem.sentences(2),
            priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
            status: faker.helpers.arrayElement(['Pending', 'Completed']),
            dueDate: faker.date.soon(),
            user: users[1]
        })
    );

    await taskRepository.save(tasks);
    log.info('✅ Tasks seeded successfully.');

    await AppDataSource.destroy();
    log.info('✅ Database connection closed.');
};

seedDatabase().catch(err => log.error('❌ Seeding failed:', err));
