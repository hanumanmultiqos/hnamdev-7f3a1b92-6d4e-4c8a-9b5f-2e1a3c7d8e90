import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule, AuditModule, UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}