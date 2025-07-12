import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Question } from './Question';
import { Answer } from './Answer';
import { Vote } from './Vote';
import { QuestionVote } from './QuestionVote';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @OneToMany(() => Question, question => question.author)
  questions: Question[];

  @OneToMany(() => Answer, answer => answer.author)
  answers: Answer[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @OneToMany(() => QuestionVote, vote => vote.user)
  questionVotes: QuestionVote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 