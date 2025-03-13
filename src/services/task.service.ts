
import { AppDataSource } from '@/config/database';
import { Task } from '../entities/task.entity';

export class TaskService {
  /**
   * Create a new task
   */
  static async createTask(taskData: Partial<Task>): Promise<Task> {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = taskRepository.create(taskData);
    return await taskRepository.save(task);
  }

  /**
   * Get all tasks
   */
  static async getAllTasks(): Promise<Task[]> {
    return await AppDataSource.getRepository(Task).find();
  }

  /**
   * Get a single task by ID
   */
  static async getTaskById(id: string): Promise<Task | null> {
    return await AppDataSource.getRepository(Task).findOne({ where: { id } });
  }

  /**
   * Update a task
   */
  static async updateTask(id: string, taskData: Partial<Task>): Promise<Task | null> {
    const taskRepository = AppDataSource.getRepository(Task);
    let task = await taskRepository.findOne({ where: { id } });

    if (!task) return null;

    taskRepository.merge(task, taskData);
    return await taskRepository.save(task);
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Task).delete(id);
    return result.affected !== 0;
  }
}
