import { TaskService } from '../src/services/task.service';
import { Task } from '../src/entities/task.entity';
import { AppDataSource } from '../src/config/database';

// Mock the database and repository
jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

// Mock the express-validator
jest.mock('express-validator');

// Define the mock repository
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
};

// Mock the getRepository method to return the mock repository
(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);



describe('TaskService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData: Partial<Task> = { title: 'Test Task', description: 'Test Description' };
      const savedTask = { id: '1', ...taskData } as Task;

      mockRepository.create.mockReturnValue(taskData);
      mockRepository.save.mockResolvedValue(savedTask);

      const result = await TaskService.createTask(taskData);

      expect(mockRepository.create).toHaveBeenCalledWith(taskData);
      expect(mockRepository.save).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(savedTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const tasks = [{ id: '1', title: 'Test Task', description: 'Test Description' }] as Task[];

      mockRepository.find.mockResolvedValue(tasks);

      const result = await TaskService.getAllTasks();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const task = { id: '1', title: 'Test Task', description: 'Test Description' } as Task;

      mockRepository.findOne.mockResolvedValue(task);

      const result = await TaskService.getTaskById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(task);
    });

    it('should return null if task is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await TaskService.getTaskById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const task = { id: '1', title: 'Test Task', description: 'Test Description' } as Task;
      const updatedTaskData: Partial<Task> = { title: 'Updated Task' };
      const updatedTask = { ...task, ...updatedTaskData };

      mockRepository.findOne.mockResolvedValue(task);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await TaskService.updateTask('1', updatedTaskData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRepository.merge).toHaveBeenCalledWith(task, updatedTaskData);
      expect(mockRepository.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(updatedTask);
    });

    it('should return null if task is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await TaskService.updateTask('1', {});

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await TaskService.deleteTask('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false if task is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await TaskService.deleteTask('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(false);
    });
  });
});

