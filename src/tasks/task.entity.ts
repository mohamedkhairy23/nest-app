import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Entity() // This decorator tells TypeORM that this class represents a table in your database
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus; // This is an enum type

  // many users to one user
  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user: User; // This is a one-to-many relationship with the User entity. The 'eager:false' option tells TypeORM to not load this relationship when fetching tasks. It's useful when you only need to fetch tasks for a specific user, not all tasks.
}
