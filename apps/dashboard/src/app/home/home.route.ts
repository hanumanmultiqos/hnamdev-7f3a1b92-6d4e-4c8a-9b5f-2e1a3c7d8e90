import { Routes } from '@angular/router';
import { Home } from './home';
import { AuditLogs } from './component/audit-logs/audit-logs';

export const homeRoutes: Routes = [
  { path: '', redirectTo: 'task-management', pathMatch: 'full' },
  {
    path: '',
    component: Home,
    children: [
      {
        path: 'activities',
        title: 'Activities',
        component: AuditLogs,
      },
      {
        path: 'task-management',
        loadChildren: () =>
          import('./component/task-management/task.routes').then(
            (m) => m.taskRoutes,
          ),
      },
    ],
  },
];
