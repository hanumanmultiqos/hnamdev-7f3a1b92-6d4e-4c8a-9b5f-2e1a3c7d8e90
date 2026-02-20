import { Routes } from '@angular/router';
import { TaskManagement } from './task-management';
import { ListTask } from './list-task/list-task';
import { AddEditTask } from './add-edit-task/add-edit-task';

export const taskRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: '',
    component: TaskManagement,
    children: [
      {
        path: 'list',
        title: 'List',
        component: ListTask,
      },
      {
        path: 'add-edit-task',
        title: 'Add Edit Task',
        component: AddEditTask,
      },
      {
        path: 'add-edit-task/:id',
        title: 'Add Edit Task',
        component: AddEditTask,
      },
    ],
  },
];
