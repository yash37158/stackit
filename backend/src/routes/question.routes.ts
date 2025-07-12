import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const questionController = new QuestionController();

// Public routes
router.get('/', questionController.getAll);
router.get('/user/count', authenticateToken, questionController.getUserQuestionsCount);
router.get('/:id', questionController.getOne);

// Protected routes
router.post('/', authenticateToken, questionController.create);
router.put('/:id', authenticateToken, questionController.update);
router.delete('/:id', authenticateToken, questionController.delete);
router.post('/:id/vote', authenticateToken, questionController.vote);

export default router; 