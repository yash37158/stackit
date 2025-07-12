import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

export enum QuestionVoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote'
}

@Entity('question_votes')
export class QuestionVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: QuestionVoteType
  })
  type: QuestionVoteType;

  @ManyToOne(() => User, user => user.questionVotes)
  user: User;

  @ManyToOne(() => Question, question => question.votes)
  question: Question;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 