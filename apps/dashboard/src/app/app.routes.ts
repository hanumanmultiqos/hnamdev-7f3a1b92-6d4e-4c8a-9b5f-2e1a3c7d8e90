import { Route } from '@angular/router';
import { checkLoginGuardGuard } from './core/guards/check-login-guard.guard';
import { authGuard } from './core/guards/auth.gaurd';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    canActivate: [checkLoginGuardGuard],
    path: '',
    loadChildren: () =>
      import('./authentication/auth.route').then((m) => m.authRoutes),
  },
  {
    canActivate: [authGuard],
    path: '',
    loadChildren: () => import('./home/home.route').then((m) => m.homeRoutes),
  },
];
