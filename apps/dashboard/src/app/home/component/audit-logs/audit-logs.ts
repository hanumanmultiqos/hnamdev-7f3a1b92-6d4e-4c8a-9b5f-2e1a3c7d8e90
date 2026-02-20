import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonConstants } from '../../../core/constants/common-constants';
import { HelperService } from '../../../core/services/helper.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomPaginationComponent } from '../../../common/custom-pagination/custom-pagination.component';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../home.service';
import { Api } from '../../../core/services/api-list';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-audit-logs',
  imports: [CustomPaginationComponent, FormsModule],
  providers: [Api, ApiService, HomeService],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.scss',
})
export class AuditLogs {
  private _helper = inject(HelperService);
  private _homeService = inject(HomeService);
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
    this._homeService.auditLogs(this.query).subscribe((res: any) => {
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
}
