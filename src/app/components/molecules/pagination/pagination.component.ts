import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() page!: number;
  @Input() size!: number;
  @Input() totalItems!: number;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.size);
  }

  get startItem(): number {
    return this.page * this.size;
  }

  get endItem(): number {
    return Math.min((this.page + 1) * this.size, this.totalItems);
  }

  getPageRange(): number[] {
    const rangeSize = 4;
    const start = Math.max(0, this.page - Math.floor(rangeSize / 2));
    const end = Math.min(this.totalPages - 1, start + rangeSize - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }
}