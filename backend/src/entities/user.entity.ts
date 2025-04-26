// src/auth/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Professor } from './professor.entity';
import { Alumni } from './alumni.entity';
import { UserType, IDType } from './enums'; // Assuming enums are imported

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string;

  @Column({ type: 'enum', enum: IDType })
  idType: IDType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column()
  gender: string;

  @Column({ nullable: true })
  university: string;
  
  @Column({ type: 'simple-array', nullable: true })
interests: string[];


  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @OneToOne(() => Student, (student) => student.user)
  @JoinColumn()
  student: Student;

  @OneToOne(() => Professor, (professor) => professor.user)
  @JoinColumn()
  professor: Professor;

  @OneToOne(() => Alumni, (alumni) => alumni.user)
  @JoinColumn()
  alumni: Alumni;
}
