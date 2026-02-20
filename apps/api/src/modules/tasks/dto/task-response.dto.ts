import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../task.entity';

class UserShortDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  createdAt: Date;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: UserShortDto, nullable: true })
  assignedTo?: UserShortDto | null;

  @ApiProperty({ type: UserShortDto, nullable: true })
  createdBy?: UserShortDto | null;
}