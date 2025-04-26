// src/auth/alumni.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Alumni {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  graduationYear: Date;

  @Column()
  degree: string;

  @Column()
  occupation: string;

  @OneToOne(() => User, (user) => user.alumni)
  @JoinColumn()
  user: User;
}
