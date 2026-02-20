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
export class PermissionsService {
  private helperService = inject(HelperService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.helperService.checkLogin(CommonConstants.TOKEN)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): any => {
  return inject(PermissionsService).canActivate(next, state);
};
