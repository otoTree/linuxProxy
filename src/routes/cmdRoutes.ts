import { Router } from 'express';
import { 
  executeCommand, 
  createSession, 
  executeSessionCommand, 
  getSessionOutput, 
  resizeSession,
  destroySession 
} from '../controllers/cmdController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Legacy stateless command execution
router.post('/', authMiddleware, executeCommand);

// Session based execution
router.post('/session', authMiddleware, createSession);
router.post('/session/:id/exec', authMiddleware, executeSessionCommand);
router.get('/session/:id/output', authMiddleware, getSessionOutput);
router.post('/session/:id/resize', authMiddleware, resizeSession);
router.delete('/session/:id', authMiddleware, destroySession);

export default router;
