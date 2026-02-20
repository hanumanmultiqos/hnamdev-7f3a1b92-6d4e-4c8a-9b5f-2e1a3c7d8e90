import { inject, Injectable } from '@angular/core';
import { CommonConstants } from '../constants/common-constants';
import { HttpHeaders } from '@angular/common/http';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  httpOptions: any;
  private _helper = inject(HelperService);

  /**
   * Summary: For get header
   */
  getHeader() {
    const token = this._helper.getLocalStorageData(CommonConstants.TOKEN);
    this.httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        // language: this.language,
        // "Accept-Language": this.language
      }),
    };
    return this.httpOptions;
  }
}
