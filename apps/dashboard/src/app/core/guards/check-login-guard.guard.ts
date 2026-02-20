import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { CommonConstants } from '../constants/common-constants';
import { HelperService } from '../services/helper.service';

@Injectable({
  providedIn: 'root',
})
export class CheckLoginService {
  private helperService = inject(HelperService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.helperService.checkLogin(CommonConstants.TOKEN)) {
      this.router.navigate(['/task-management']);
    }
  }
}

export const checkLoginGuardGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): any => {
  return inject(CheckLoginService).canActivate(next, state);
};
