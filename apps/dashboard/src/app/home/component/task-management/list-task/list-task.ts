import swal from 'sweetalert2';
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { HelperService } from '../../../../core/services/helper.service';
import { TaskService } from '../task.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonConstants } from '../../../../core/constants/common-constants';
import { Api } from '../../../../core/services/api-list';
import { ApiService } from '../../../../core/services/api.service';
import { CustomPaginationComponent } from '../../../../common/custom-pagination/custom-pagination.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-task',
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    CustomPaginationComponent,
  ],
  providers: [TaskService, Api, ApiService, CommonConstants],
  templateUrl: './list-task.html',
  styleUrl: './list-task.scss',
})
export class ListTask implements OnInit {
  private _helper = inject(HelperService);
  private _taskService = inject(TaskService);
  private _router = inject(Router);
  pageName = 'Task Management';
  query: any = {
    page: 1,
    limit: 10,
    search: '',
    sortOrder: 'DESC',
    sortBy: '',
  };
  list = signal<any[]>([]);
  totalItem = signal<any>(0);
  private subject: Subject<string> = new Subject();
  userRole: string | null = this._helper.getLocalStorageData(
    CommonConstants.USER_DATA,
  );
  user = signal('');
  constructor() {
    this.user?.set(this.userRole ?? '');
    this.searchData();
  }
  ngOnInit(): void {
    this.getList();
  }

  searchData() {
    this.subject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((res: string) => {
        this.getList();
      });
  }
  sort(key: string) {
    this.query.sortOrder = this.query.sortOrder == 'ASC' ? 'DESC' : 'ASC';
    this.query.sortBy = key;
    this.getList();
  }

  getList() {
    this._taskService.list(this.query).subscribe((res: any) => {
      if (res) {
        this.list.set(res?.data);
        this.totalItem.set(res.totalPages);
      } else {
        this._helper.toast(res?.message, 'error');
      }
    });
  }

  applySearch(event: any) {
    const term = event;
    this.query.search = term;
    this.query.page = 1;
    this.subject.next(term);
  }

  changeItemsPerPage(e: any) {
    this.query.page = 1;
    this.query.limit = e;
    this.getList();
  }

  pageChange = (obj: any) => {
    this.query.page = obj;
    this.getList();
  };

  addEditTask(id: any) {
    this._router.navigate(['task-management/add-edit-task/' + id]);
  }

  deleteTask(id: any) {
    swal
      .fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this._taskService.delete(id).subscribe((res: any) => {
            if (res) {
              this.getList();
              swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            } else {
              this._helper.toast(res?.message, 'error');
            }
          });
        }
      });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.list(), event.previousIndex, event.currentIndex);
  }
}
