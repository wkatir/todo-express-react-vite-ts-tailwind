import { Router, type IRouter } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router: IRouter = Router();

router.use(authMiddleware);

router.get('/', getCategories);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('color').optional().isString(),
  ],
  createCategory
);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('color').optional().isString(),
  ],
  updateCategory
);

router.delete('/:id', deleteCategory);

export default router;

