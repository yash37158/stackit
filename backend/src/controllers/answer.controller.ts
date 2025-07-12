import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Answer } from '../entities/Answer';
import { Question } from '../entities/Question';
import { Vote, VoteType } from '../entities/Vote';
import { User } from '../entities/User';

export class AnswerController {
  private answerRepository = AppDataSource.getRepository(Answer);
  private questionRepository = AppDataSource.getRepository(Question);
  private voteRepository = AppDataSource.getRepository(Vote);

  // Create a new answer
  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { questionId, content } = req.body;
      const user = req.user as User;

      const question = await this.questionRepository.findOne({
        where: { id: questionId }
      });

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      const answer = this.answerRepository.create({
        content,
        author: user,
        question
      });

      await this.answerRepository.save(answer);

      // Fetch the answer with all relations to match the structure expected by frontend
      const savedAnswer = await this.answerRepository.findOne({
        where: { id: answer.id },
        relations: ['author', 'votes', 'votes.user']
      });

      return res.status(201).json(savedAnswer);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating answer' });
    }
  };

  // Update an answer
  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = req.user as User;

      const answer = await this.answerRepository.findOne({
        where: { id },
        relations: ['author']
      });

      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      if (answer.author.id !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this answer' });
      }

      answer.content = content;
      await this.answerRepository.save(answer);

      return res.json(answer);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating answer' });
    }
  };

  // Delete an answer
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      const answer = await this.answerRepository.findOne({
        where: { id },
        relations: ['author']
      });

      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      if (answer.author.id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this answer' });
      }

      await this.answerRepository.remove(answer);

      return res.json({ message: 'Answer deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting answer' });
    }
  };

  // Accept an answer
  public accept = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      const answer = await this.answerRepository.findOne({
        where: { id },
        relations: ['question', 'question.author']
      });

      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      if (answer.question.author.id !== user.id) {
        return res.status(403).json({ message: 'Only the question author can accept answers' });
      }

      // Remove accepted status from any previously accepted answer
      await this.answerRepository.update(
        { question: { id: answer.question.id }, isAccepted: true },
        { isAccepted: false }
      );

      // Accept the current answer
      answer.isAccepted = true;
      await this.answerRepository.save(answer);

      // Fetch the answer with all relations to match the structure expected by frontend
      const savedAnswer = await this.answerRepository.findOne({
        where: { id: answer.id },
        relations: ['author', 'votes', 'votes.user']
      });

      return res.json(savedAnswer);
    } catch (error) {
      return res.status(500).json({ message: 'Error accepting answer' });
    }
  };

  // Vote on an answer
  public vote = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const user = req.user as User;

      if (!Object.values(VoteType).includes(type)) {
        return res.status(400).json({ message: 'Invalid vote type' });
      }

      const answer = await this.answerRepository.findOne({
        where: { id },
        relations: ['votes', 'votes.user']
      });

      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      // Check if user has already voted
      let vote = answer.votes.find(v => v.user.id === user.id);

      if (vote) {
        if (vote.type === type) {
          // Remove vote if same type
          await this.voteRepository.remove(vote);
        } else {
          // Update vote type if different
          vote.type = type;
          await this.voteRepository.save(vote);
        }
      } else {
        // Create new vote
        vote = this.voteRepository.create({
          type,
          user,
          answer
        });
        await this.voteRepository.save(vote);
      }

      // Fetch the updated answer with all relations
      const updatedAnswer = await this.answerRepository.findOne({
        where: { id: answer.id },
        relations: ['author', 'votes', 'votes.user']
      });

      return res.json(updatedAnswer);
    } catch (error) {
      return res.status(500).json({ message: 'Error voting on answer' });
    }
  };

  // Get user's answers count
  public getUserAnswersCount = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = req.user as User;

      const count = await this.answerRepository.count({
        where: { author: { id: user.id } }
      });

      return res.json({ count });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user answers count' });
    }
  };
} 