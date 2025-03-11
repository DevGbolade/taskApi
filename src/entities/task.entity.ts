import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 }) 
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' }) 
  dueDate!: Date;

  @Column({ 
    type: 'enum', 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  })
  priority!: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  })
  status!: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user!: User;
}