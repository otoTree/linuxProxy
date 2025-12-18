import { Router } from 'express';
import { executeCommand } from '../controllers/cmdController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, executeCommand);

export default router;
