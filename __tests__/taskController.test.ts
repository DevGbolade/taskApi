import { Request, Response } from 'express';
import { TaskController } from '../src/controllers/task.controller';
import { validationResult } from 'express-validator';
import { TaskService } from '../src/services/task.service';
import { Task } from '../src/entities/task.entity';

// Mock the database and repository
jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

// Mock the TaskService with proper typing
jest.mock('../src/services/task.service');

// Cast mocked services to jest.Mock type for TypeScript
const mockedTaskService = TaskService as jest.Mocked<typeof TaskService>;

// Mock the express-validator
jest.mock('express-validator');

// Mock the Request and Response objects
const mockRequest = (body: any = {}, params: any = {}) => ({
  body,
  params,
} as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};


describe('TaskController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should return 400 if validation fails', async () => {
      const req = mockRequest();
      const res = mockResponse();
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => ['Validation error'],
      });

      await TaskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Validation error'] });
    });

    it('should create a task and return 201', async () => {
      const req = mockRequest({ title: 'Test Task', description: 'Test Description' });
      const res = mockResponse();
      const task = { id: '1', ...req.body } as Task;

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      mockedTaskService.createTask.mockResolvedValue(task);

      await TaskController.createTask(req, res);

      expect(mockedTaskService.createTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it('should return 500 if an error occurs', async () => {
      const req = mockRequest({ title: 'Test Task', description: 'Test Description' });
      const res = mockResponse();

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      mockedTaskService.createTask.mockRejectedValue(new Error('Internal Server Error'));

      await TaskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const tasks = [{ id: '1', title: 'Test Task', description: 'Test Description' }] as Task[];

      mockedTaskService.getAllTasks.mockResolvedValue(tasks);

      await TaskController.getAllTasks(req, res);

      expect(mockedTaskService.getAllTasks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it('should return 500 if an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockedTaskService.getAllTasks.mockRejectedValue(new Error('Internal Server Error'));

      await TaskController.getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();
      const task = { id: '1', title: 'Test Task', description: 'Test Description' } as Task;

      mockedTaskService.getTaskById.mockResolvedValue(task);

      await TaskController.getTaskById(req, res);

      expect(mockedTaskService.getTaskById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it('should return 404 if task is not found', async () => {
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      mockedTaskService.getTaskById.mockResolvedValue(null);

      await TaskController.getTaskById(req, res);

      expect(mockedTaskService.getTaskById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      mockedTaskService.getTaskById.mockRejectedValue(new Error('Internal Server Error'));

      await TaskController.getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const req = mockRequest({ title: 'Updated Task' }, { id: '1' });
      const res = mockResponse();
      const updatedTask = { id: '1', title: 'Updated Task', description: 'Test Description' } as Task;

      mockedTaskService.updateTask.mockResolvedValue(updatedTask);

      await TaskController.updateTask(req, res);

      expect(mockedTaskService.updateTask).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('should return 404 if task is not found', async () => {
      const req = mockRequest({ title: 'Updated Task' }, { id: '1' });
      const res = mockResponse();

      mockedTaskService.updateTask.mockResolvedValue(null);

      await TaskController.updateTask(req, res);

      expect(mockedTaskService.updateTask).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = mockRequest({ title: 'Updated Task' }, { id: '1' });
      const res = mockResponse();

      mockedTaskService.updateTask.mockRejectedValue(new Error('Internal Server Error'));

      await TaskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      mockedTaskService.deleteTask.mockResolvedValue(true);

      await TaskController.deleteTask(req, res);

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 404 if task is not found', async () => {
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      mockedTaskService.deleteTask.mockResolvedValue(false);

      await TaskController.deleteTask(req, res);

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      mockedTaskService.deleteTask.mockRejectedValue(new Error('Internal Server Error'));

      await TaskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});