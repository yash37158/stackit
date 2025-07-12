import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Answer } from './Answer';
import { Tag } from './Tag';
import { QuestionVote } from './QuestionVote';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, user => user.questions)
  author: User;

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];

  @OneToMany(() => QuestionVote, vote => vote.question)
  votes: QuestionVote[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 