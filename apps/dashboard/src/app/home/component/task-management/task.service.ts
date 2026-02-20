import { inject, Injectable } from '@angular/core';
import { Api } from '../../../core/services/api-list';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _apiService = inject(ApiService);
  private _api = inject(Api);

  /**
   * for getting list
   * @param data
   */
  list(data: any) {
    return this._apiService.get(this._api.API.TASK.LIST, data);
  }

  /**
   * for getting details of
   * @param data
   */
  view(data: any) {
    return this._apiService.get(this._api.API.TASK.VIEW + `/${data}`);
  }

  /**
   * for add or edit
   * @param data
   */
  addEdit(data: any, editMode: any, id?: any) {
    if (editMode == 'Edit') {
      return this._apiService.patch(
        this._api.API.TASK.ADD_EDIT + `/${id}`,
        data,
      );
    } else {
      return this._apiService.post(this._api.API.TASK.ADD_EDIT, data);
    }
  }

  /**
   * for delete
   * @param data
   */
  delete(data: any) {
    return this._apiService.delete(this._api.API.TASK.DELETE + `/${data}`);
  }

  listAssignUser() {
    return this._apiService.get(this._api.API.USER.LIST);
  }
}
