// src/auth/student.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  formation: string;

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn()
  user: User;
}
