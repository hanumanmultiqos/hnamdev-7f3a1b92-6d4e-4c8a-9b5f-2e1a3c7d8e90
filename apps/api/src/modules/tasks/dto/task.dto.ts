import { IsString, MinLength, IsOptional, IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TaskStatus } from '../task.entity';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Setup project', description: 'Title of the task' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Setup NestJS project with TypeORM', description: 'Detailed description of the task' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({ example: 'Development', description: 'Category of the task' })
  @IsString()
  @MinLength(3)
  category: string;

  @ApiPropertyOptional({ example: TaskStatus.TODO, enum: TaskStatus, description: 'Current status of the task' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID of the user assigned to this task' })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}

// Update DTO derived from Create DTO
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// DTO for listing tasks with pagination/search/sort
export class ListTaskDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of tasks per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'Setup', description: 'Search term for title, description, or category' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'], description: 'Sort order: ASC or DESC' })
  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'] as const)
  sortOrder?: 'ASC' | 'DESC';
}