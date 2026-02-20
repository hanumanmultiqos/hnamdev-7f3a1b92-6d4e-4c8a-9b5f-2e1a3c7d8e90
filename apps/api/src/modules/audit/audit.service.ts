import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Audit } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(private dataSource: DataSource) {}

  async log(
    userId: string,
    action: string,
    entityId?: string,
    entityType?: string,
  ) {
    const repo = this.dataSource.getRepository(Audit);
    const audit = repo.create({ userId, action, entityId, entityType });
    await repo.save(audit);
  }
}