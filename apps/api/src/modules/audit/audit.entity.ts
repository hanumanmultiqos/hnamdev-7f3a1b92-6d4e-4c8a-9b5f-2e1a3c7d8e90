import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from 'typeorm';

@Entity()
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  entityId?: string;

  @Column({ nullable: true })
  entityType?: string;

  @CreateDateColumn()
  createdAt: Date;
}