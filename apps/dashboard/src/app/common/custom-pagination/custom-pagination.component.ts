import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-custom-pagination',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss'
})
export class CustomPaginationComponent {
  @Input() perPage: any;
  @Input() parentComp: boolean = false;
  @Input() totalCount: any;
  @Input() currentPage: any;
  math = Math
  @Output() pageChanged = new EventEmitter<any>();
  @Output() changeItem = new EventEmitter<any>();
  constructor() {}

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.perPage);
  }

  get pages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, '...', total);
      } else if (this.currentPage >= total - 2) {
        pages.push(1, '...', total - 2, total - 1, total);
      } else {
        pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', total);
      }
    }

    return pages;
  }

  changeItemsPerPage(page: string) {
    this.changeItem.emit(+page);
  }

  goToPage(page: number) {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

}
