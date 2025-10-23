import { Router, type IRouter } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';

const router: IRouter = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/stats', getTaskStats);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
    body('categoryIds').optional().isArray(),
  ],
  createTask
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('completed').optional().isBoolean().withMessage('Completed must be boolean'),
    body('dueDate').optional(),
    body('categoryIds').optional().isArray(),
  ],
  updateTask
);

router.delete('/:id', deleteTask);

export default router;

