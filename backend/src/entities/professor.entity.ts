// src/auth/professor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column()
  rank: string;

  @OneToOne(() => User, (user) => user.professor)
  @JoinColumn()
  user: User;
}
