import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User, UserRole } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, username } = req.body;

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        username,
        role: UserRole.USER
      });

      await this.userRepository.save(user);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error registering user' });
    }
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging in' });
    }
  };
} 