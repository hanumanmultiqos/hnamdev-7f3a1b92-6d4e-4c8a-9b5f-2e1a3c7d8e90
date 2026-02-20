import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../../common/enums/role.enum';
import { CreateTaskDto, UpdateTaskDto, ListTaskDto } from './dto/task.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply both JWT and RolesGuard
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ------------------------
  // Create Task
  // ------------------------
  @Post()
  @Roles(RoleType.OWNER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: CreateTaskDto })
  @ApiBody({ type: CreateTaskDto })
  create(@Body() dto: CreateTaskDto, @GetUser() user: UserPayload) {
    return this.tasksService.create(dto, user);
  }

  // ------------------------
  // List Tasks with optional query filters
  // ------------------------
  @Get()
  @Roles(RoleType.OWNER, RoleType.ADMIN, RoleType.VIEWER)
  @ApiOperation({ summary: 'List tasks with pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Setup' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  findAll(@GetUser() user: UserPayload, @Query() query: ListTaskDto) {
    return this.tasksService.findAll(user, query);
  }

  // ------------------------
  // Get single task by ID
  // ------------------------
  @Get(':id')
  @Roles(RoleType.OWNER, RoleType.ADMIN, RoleType.VIEWER)
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiParam({ name: 'id', description: 'Task UUID', type: String, example: '550e8400-e29b-41d4-a716-446655440000' })
  findOne(@Param('id') id: string, @GetUser() user: UserPayload) {
    return this.tasksService.findOne(id, user);
  }

  // ------------------------
  // Update Task
  // ------------------------
  @Patch(':id')
  @Roles(RoleType.OWNER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', description: 'Task UUID', type: String, example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateTaskDto })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @GetUser() user: UserPayload) {
    return this.tasksService.update(id, dto, user);
  }

  // ------------------------
  // Delete Task
  // ------------------------
  @Delete(':id')
  @Roles(RoleType.OWNER)
  @ApiOperation({ summary: 'Delete a task (Owner only)' })
  @ApiParam({ name: 'id', description: 'Task UUID', type: String, example: '550e8400-e29b-41d4-a716-446655440000' })
  remove(@Param('id') id: string, @GetUser() user: UserPayload) {
    return this.tasksService.remove(id, user);
  }
}