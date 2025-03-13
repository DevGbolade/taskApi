import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { validationResult } from 'express-validator';

export class TaskController {
  /**
   * @route POST /api/tasks
   * @desc Create new task
   * @access Private
   */
  public static async createTask(req: Request, res: Response): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await TaskService.createTask(req.body);
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  /**
   * @route GET /api/tasks
   * @desc Retrieve all tasks
   * @access Private
   */
  static async getAllTasks(_req: Request, res: Response): Promise<any> {
    try {
      const tasks = await TaskService.getAllTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  /**
   * @route GET /api/tasks/:id
   * @desc Retrieve single task
   * @access Private
   */
  static async getTaskById(req: Request, res: Response): Promise<any> {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  /**
   * @route PUT /api/tasks/:id
   * @desc Update a task
   * @access Private
   */
  static async updateTask(req: Request, res: Response): Promise<any> {
    try {
      const updatedTask = await TaskService.updateTask(req.params.id, req.body);
      if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  /**
   * @route DELETE /api/tasks/:id
   * @desc Delete a task
   * @access Private
   */
  static async deleteTask(req: Request, res: Response): Promise<any> {
    try {
      const deleted = await TaskService.deleteTask(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Task not found' });

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
