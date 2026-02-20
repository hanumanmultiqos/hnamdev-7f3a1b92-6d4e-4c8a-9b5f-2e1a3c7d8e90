import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user: UserPayload = req.user;

    const method = req.method;
    const url = req.url;

    let action = `${method}_${url}`; // fallback action

    // Optional: customize action names for tasks
    if (url.includes('tasks') && method === 'POST') action = 'CREATE_TASK';
    if (url.includes('tasks') && method === 'PATCH') action = 'UPDATE_TASK';
    if (url.includes('tasks') && method === 'DELETE') action = 'DELETE_TASK';

    const entityId = req.params?.id;
    const entityType = url.includes('tasks') ? 'Task' : undefined;

    return next.handle().pipe(
      tap(() => {
        if (user) {
          this.auditService.log(user.userId, action, entityId, entityType);
        }
      }),
    );
  }
}