import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { RoleType } from '../../common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'text',
  })
  role: RoleType;

  @ManyToOne(() => Organization, { eager: true })
  organization: Organization;

  @Column()
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;
}