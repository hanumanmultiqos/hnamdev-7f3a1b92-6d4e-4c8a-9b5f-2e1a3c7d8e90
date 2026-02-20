import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListAuditDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of logs per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'CREATE_TASK', description: 'Filter logs by action type' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ example: 'Task', description: 'Filter logs by entity type' })
  @IsOptional()
  @IsString()
  entityType?: string;
}