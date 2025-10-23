import { Router, type IRouter } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router: IRouter = Router();

router.use(authMiddleware);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
  ],
  createTask
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('completed').optional().isBoolean().withMessage('Completed must be boolean'),
  ],
  updateTask
);

router.delete('/:id', deleteTask);

export default router;

