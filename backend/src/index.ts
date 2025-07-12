import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/ormconfig';

// Import routes
import authRoutes from './routes/auth.routes';
import questionRoutes from './routes/question.routes';
import answerRoutes from './routes/answer.routes';
import tagRoutes from './routes/tag.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/tags', tagRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to StackIt API' });
});

// Initialize database connection and start server
const PORT = process.env.PORT || 8000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
