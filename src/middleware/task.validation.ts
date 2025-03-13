import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const taskValidationMiddleware = [
  body('title').notEmpty().withMessage('Title is required'),
  body('dueDate').isISO8601().toDate().withMessage('Invalid due date'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('status').optional().isIn(['Pending', 'Completed']),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];