import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { RoleType } from '../../common/enums/role.enum';
import { CreateTaskDto, UpdateTaskDto, ListTaskDto } from './dto/task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private auditService: AuditService,
  ) {}

  private mapTask(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      category: task.category,
      status: task.status,
      createdAt: task.createdAt,
      assignedTo: task.assignedTo
        ? {
          id: task.assignedTo.id,
          username: task.assignedTo.username,
          createdAt: task.assignedTo.createdAt,
        }
        : null,
      createdBy: task.createdBy
        ? {
          id: task.createdBy.id,
          username: task.createdBy.username,
          createdAt: task.createdBy.createdAt,
        }
        : null,
    };
  }

  // ------------------------
  // Create Task
  // ------------------------
  async create(dto: CreateTaskDto, user: UserPayload) {
    let assignedToId: string | undefined;

    if (dto.assignedToId) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: dto.assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `Assigned user with id ${dto.assignedToId} does not exist`,
        );
      }

      assignedToId = assignedUser.id;
    }

    const task = this.taskRepository.create({
      ...dto,
      organizationId: user.organizationId,
      createdById: user.userId,
      assignedToId,
    });

    const saved: Task = await this.taskRepository.save(task);

    const fullTask = await this.taskRepository.findOne({
      where: { id: saved.id },
      relations: ['createdBy', 'assignedTo'],
    });

    await this.auditService.log(user.userId, 'CREATE_TASK', saved.id, 'Task');

    return this.mapTask(fullTask!);
  }

  // ------------------------
  // List Tasks with pagination, search, and sorting
  // ------------------------
  async findAll(user: UserPayload, query: ListTaskDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .addSelect(['assignedTo.id', 'assignedTo.username', 'assignedTo.createdAt'])
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .addSelect(['createdBy.id', 'createdBy.username', 'createdBy.createdAt'])
      .where('task.organizationId = :orgId', { orgId: user.organizationId });

    if (user.role === RoleType.VIEWER) {
      qb.andWhere('assignedTo.id = :userId', { userId: user.userId });
    }

    if (query.search) {
      qb.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'DESC';
    qb.orderBy(`task.${sortBy}`, sortOrder);

    qb.skip(skip).take(limit);

    const [tasks, total] = await qb.getManyAndCount();

    return {
      data: tasks.map((task) => this.mapTask(task)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  // ------------------------
  // Get single task
  // ------------------------
  async findOne(id: string, user: UserPayload) {
    const task = await this.taskRepository.findOne({
      where: { id, organization: { id: user.organizationId } },
      relations: ['createdBy', 'assignedTo'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (user.role === RoleType.VIEWER && task.assignedTo?.id !== user.userId) {
      throw new ForbiddenException('You cannot view this task');
    }

    return this.mapTask(task);
  }

  // ------------------------
  // Update Task
  // ------------------------
  async update(id: string, dto: UpdateTaskDto, user: UserPayload) {
    const task = await this.taskRepository.findOne({
      where: { id, organizationId: user.organizationId },
      relations: ['createdBy', 'assignedTo'],
    });

    if(!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      user.role === RoleType.VIEWER ||
      (user.role === RoleType.ADMIN && task.createdBy.id !== user.userId)
    ) {
      throw new ForbiddenException('You cannot update this task');
    }

    if (dto.assignedToId) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: dto.assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException(
          `Assigned user with id ${dto.assignedToId} does not exist`,
        );
      }

      task.assignedToId = dto.assignedToId;
      delete dto.assignedToId;
    }

    Object.assign(task, dto);

    const updated = await this.taskRepository.save(task);

    await this.auditService.log(user.userId, 'UPDATE_TASK', updated.id, 'Task');

    return updated;
  }

  // ------------------------
  // Delete Task
  // ------------------------
  async remove(id: string, user: UserPayload) {
    const task = await this.taskRepository.findOne({
      where: { id, organizationId: user.organizationId },
    });

    if(!task) {
      throw new NotFoundException('Task not found');
    }

    if (user.role !== RoleType.OWNER) {
      throw new ForbiddenException('Only owner can delete tasks');
    }

    await this.taskRepository.remove(task);

    await this.auditService.log(user.userId, 'DELETE_TASK', task.id, 'Task');

    return { message: 'Task deleted successfully' };
  }
}