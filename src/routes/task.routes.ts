import { NextFunction, Router, Request, Response } from 'express';
import { TaskController } from '../controllers/task.controller';
import { taskValidationMiddleware } from '@/middleware/task.validation';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/',
    [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDate').isISO8601().toDate().withMessage('Invalid due date'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
        body('status').optional().isIn(['Pending', 'Completed']),
    authMiddleware,
  ], TaskController.createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Task]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', TaskController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Retrieve a single task
 *     tags: [Task]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */
router.get('/:id', TaskController.getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     security:
 *       - BearerAuth: []   # Require JWT Authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request (Invalid input)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Insufficient permissions)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', (req, res) => TaskController.updateTask(req, res));


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete('/:id', TaskController.deleteTask);

export const taskRoutes = router;