import { inject, Injectable } from '@angular/core';
import {Api} from "../core/services/api-list";
import {ApiService} from "../core/services/api.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private  _apiService= inject(ApiService);
  private  _api= inject(Api);  
  /**
   * for counsellor login
   * @param data
   */
  login(data: any) {
    return this._apiService.post(this._api.API.AUTH.LOGIN, data);
  }
}
