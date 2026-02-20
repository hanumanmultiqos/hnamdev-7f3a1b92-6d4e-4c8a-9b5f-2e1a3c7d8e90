import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Parent org (nullable)
  @ManyToOne(() => Organization, (org) => org.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent: Organization;

  // Children orgs
  @OneToMany(() => Organization, (org) => org.parent)
  children: Organization[];
}