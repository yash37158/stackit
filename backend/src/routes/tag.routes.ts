import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
const tagController = new TagController();

// Public routes
router.get('/', tagController.getAll);
router.get('/popular', tagController.getPopular);

// Admin only routes
router.post('/', authenticateToken, isAdmin, tagController.create);
router.put('/:id', authenticateToken, isAdmin, tagController.update);
router.delete('/:id', authenticateToken, isAdmin, tagController.delete);

export default router; 