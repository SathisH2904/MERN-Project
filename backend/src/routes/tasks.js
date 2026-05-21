import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTaskStatus,
} from '../controllers/taskController.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
