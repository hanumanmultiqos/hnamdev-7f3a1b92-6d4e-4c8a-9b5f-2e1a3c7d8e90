import { Injectable, inject } from '@angular/core';
import { Api } from '../core/services/api-list';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _apiService = inject(ApiService);
  private _api = inject(Api);

  /**
   * for counsellor login
   * @param data
   */
  login(data: any) {
    return this._apiService.post(this._api.API.AUTH.LOGIN, data);
  }

  auditLogs(data: any) {
    return this._apiService.get(this._api.API.AUDIT_LOGS.LIST, data);
  }
}
