import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Question } from '../entities/Question';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';
import { QuestionVote } from '../entities/QuestionVote';
import { uploadImage } from '../utils/cloudinary';

export class QuestionController {
  private questionRepository = AppDataSource.getRepository(Question);
  private tagRepository = AppDataSource.getRepository(Tag);
  private questionVoteRepository = AppDataSource.getRepository(QuestionVote);

  // Create a new question
  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, description, tagIds } = req.body;
      const user = req.user as User;

      // Handle tag IDs only - no automatic tag creation
      let tags: Tag[] = [];
      if (tagIds && tagIds.length > 0) {
        // Find tags by IDs only
        tags = await this.tagRepository.findByIds(tagIds);
      }
      
      if (!tags.length) {
        return res.status(400).json({ message: 'No valid tags provided' });
      }

      // Handle image uploads if present in the rich text description
      // This would require frontend to send base64 images or use multipart form data
      // The actual implementation would depend on your frontend implementation

      const question = this.questionRepository.create({
        title,
        description,
        author: user,
        tags
      });

      await this.questionRepository.save(question);

      return res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      return res.status(500).json({ message: 'Error creating question' });
    }
  };

  // Get all questions with pagination
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const tag = req.query.tag as string;
      const search = req.query.search as string;
      const filter = req.query.filter as string;

      const queryBuilder = this.questionRepository
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.author', 'author')
        .leftJoinAndSelect('question.tags', 'tags')
        .leftJoinAndSelect('question.answers', 'answers')
        .leftJoinAndSelect('answers.author', 'answerAuthor')
        .leftJoinAndSelect('answers.votes', 'answerVotes')
        .leftJoinAndSelect('answerVotes.user', 'voteUser')
        .leftJoinAndSelect('question.votes', 'questionVotes')
        .leftJoinAndSelect('questionVotes.user', 'questionVoteUser')
        .orderBy('question.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (tag) {
        queryBuilder.andWhere('tags.name = :tag', { tag });
      }

      if (search) {
        queryBuilder.andWhere(
          '(LOWER(question.title) LIKE LOWER(:search) OR LOWER(question.description) LIKE LOWER(:search))',
          { search: `%${search}%` }
        );
      }

      // Handle different filter types
      if (filter) {
        switch (filter) {
          case 'unanswered':
            // For now, we'll skip the unanswered filter to avoid SQL issues
            // This can be implemented later with proper subquery syntax
            break;
          case 'popular':
            queryBuilder.orderBy('question.viewCount', 'DESC');
            break;
          case 'active':
            queryBuilder.orderBy('question.updatedAt', 'DESC');
            break;
          case 'votes':
            // For votes, we'll order by the number of answers (as a proxy for engagement)
            // In a real implementation, you'd want to count actual votes
            queryBuilder.orderBy('question.viewCount', 'DESC');
            break;
          case 'views':
            queryBuilder.orderBy('question.viewCount', 'DESC');
            break;
          case 'newest':
          default:
            queryBuilder.orderBy('question.createdAt', 'DESC');
            break;
        }
      }

      const [questions, total] = await queryBuilder.getManyAndCount();

      return res.json({
        questions,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching questions' });
    }
  };

  // Get a single question by ID
  public getOne = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['author', 'tags', 'answers', 'answers.author', 'answers.votes', 'answers.votes.user', 'votes', 'votes.user']
      });

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      // Increment view count
      question.viewCount += 1;
      await this.questionRepository.save(question);

      return res.json(question);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching question' });
    }
  };

  // Update a question
  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { title, description, tagIds } = req.body;
      const user = req.user as User;

      const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['author', 'tags']
      });

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      if (question.author.id !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this question' });
      }

      // Update tags if provided
      if (tagIds) {
        // Handle tag IDs only - no automatic tag creation
        let tags: Tag[] = [];
        if (tagIds.length > 0) {
          // Find tags by IDs only
          tags = await this.tagRepository.findByIds(tagIds);
        }
        question.tags = tags;
      }

      // Update other fields
      question.title = title || question.title;
      question.description = description || question.description;

      await this.questionRepository.save(question);

      return res.json(question);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating question' });
    }
  };

  // Delete a question
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['author']
      });

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      if (question.author.id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this question' });
      }

      await this.questionRepository.remove(question);

      return res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting question' });
    }
  };

  // Vote on a question
  public vote = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const user = req.user as User;

      const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['votes', 'votes.user']
      });

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      // Check if user has already voted
      const existingVote = await this.questionVoteRepository.findOne({
        where: {
          question: { id },
          user: { id: user.id }
        }
      });

      if (existingVote) {
        // Update existing vote
        existingVote.type = type;
        await this.questionVoteRepository.save(existingVote);
      } else {
        // Create new vote
        const vote = this.questionVoteRepository.create({
          type,
          user,
          question
        });
        await this.questionVoteRepository.save(vote);
      }

      // Return updated question with votes
      const updatedQuestion = await this.questionRepository.findOne({
        where: { id },
        relations: ['author', 'tags', 'answers', 'answers.author', 'answers.votes', 'answers.votes.user', 'votes', 'votes.user']
      });

      return res.json(updatedQuestion);
    } catch (error) {
      console.error('Error voting on question:', error);
      return res.status(500).json({ message: 'Error voting on question' });
    }
  };

  // Get user's questions count
  public getUserQuestionsCount = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = req.user as User;

      const count = await this.questionRepository.count({
        where: { author: { id: user.id } }
      });

      return res.json({ count });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user questions count' });
    }
  };
} 