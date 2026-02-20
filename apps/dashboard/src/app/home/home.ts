import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonConstants } from '../core/constants/common-constants';
import { HelperService } from '../core/services/helper.service';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private _helper = inject(HelperService);
  private _router = inject(Router);
  user = signal('');
  userRole: string | null;

  constructor() {
    this.userRole = this._helper.getLocalStorageData(CommonConstants.USER_DATA);
    if (this.userRole) {
      this.user.set(this.userRole);
    }
  }

  logOut() {
    this._helper.clearLocalStorageData();
    this._router.navigate(['/login']);
  }
}
