import { Login } from './component/login/login';
import { Routes } from '@angular/router';
import { Authentication } from './authentication';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: Authentication,
    children: [
      {
        path: 'login',
        title: 'Login',
        component: Login,
      },
    ],
  },
];
