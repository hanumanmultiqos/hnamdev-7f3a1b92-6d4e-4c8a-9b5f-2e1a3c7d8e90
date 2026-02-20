import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { Audit } from './audit.entity';
import { AuditController } from './audit.controller'; // 👈 ADD THIS

@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}