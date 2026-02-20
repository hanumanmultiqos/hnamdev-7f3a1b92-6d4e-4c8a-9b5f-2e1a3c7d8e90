import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RoleType } from '../../common/enums/role.enum';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAssignableUsers(currentUser: UserPayload) {
    return this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username'])
      .where('user.organizationId = :orgId', {
        orgId: currentUser.organizationId,
      })
      .andWhere('user.role != :ownerRole', {
        ownerRole: RoleType.OWNER
      })
      .orderBy('user.username', 'ASC')
      .getMany();
  }
}