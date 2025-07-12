import { Router } from 'express';
import { AnswerController } from '../controllers/answer.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const answerController = new AnswerController();

// All routes are protected
router.post('/', authenticateToken, answerController.create);
router.get('/user/count', authenticateToken, answerController.getUserAnswersCount);
router.put('/:id', authenticateToken, answerController.update);
router.delete('/:id', authenticateToken, answerController.delete);
router.post('/:id/accept', authenticateToken, answerController.accept);
router.post('/:id/vote', authenticateToken, answerController.vote);

export default router; 