import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Tag } from '../entities/Tag';

export class TagController {
  private tagRepository = AppDataSource.getRepository(Tag);

  // Create a new tag (admin only)
  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, description } = req.body;

      // Check if tag already exists
      const existingTag = await this.tagRepository.findOne({ where: { name } });
      if (existingTag) {
        return res.status(400).json({ message: 'Tag already exists' });
      }

      const tag = this.tagRepository.create({ name, description });
      await this.tagRepository.save(tag);

      return res.status(201).json(tag);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating tag' });
    }
  };

  // Get all tags
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const tags = await this.tagRepository.find({
        order: { name: 'ASC' }
      });

      return res.json(tags);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching tags' });
    }
  };

  // Get popular tags
  public getPopular = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .leftJoin('tag.questions', 'question')
        .select(['tag.id', 'tag.name', 'tag.description'])
        .addSelect('COUNT(question.id)', 'questionCount')
        .groupBy('tag.id')
        .orderBy('questionCount', 'DESC')
        .limit(limit)
        .getRawMany();

      return res.json(tags);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching popular tags' });
    }
  };

  // Update a tag (admin only)
  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const tag = await this.tagRepository.findOne({ where: { id } });
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }

      // Check if new name already exists
      if (name && name !== tag.name) {
        const existingTag = await this.tagRepository.findOne({ where: { name } });
        if (existingTag) {
          return res.status(400).json({ message: 'Tag name already exists' });
        }
        tag.name = name;
      }

      if (description) {
        tag.description = description;
      }

      await this.tagRepository.save(tag);

      return res.json(tag);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating tag' });
    }
  };

  // Delete a tag (admin only)
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const tag = await this.tagRepository.findOne({ where: { id } });
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }

      await this.tagRepository.remove(tag);

      return res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting tag' });
    }
  };
} 