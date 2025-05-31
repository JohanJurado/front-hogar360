import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '@app/core/models/dtos/tableColumn';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T = any> {
  @Input() data: T[] | null = [];
  @Input() columns!: TableColumn[];
  @Input() currentPage: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() order = new EventEmitter<{ orderBy: string, orderAsc: boolean }>();

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }

  getProperty(item: any, key: string): any {
    return key.split('.').reduce((o, i) => o?.[i], item);
  }

  formatNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }

  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }

  newOrder(key: string){

    for (let element of this.columns) {
      
      if (element.key != key && element.isActive === true){
        element.isActive = !element.isActive;
      
      } else if (element.key == key){
        if (element.isActive === false){
          element.isActive = !element.isActive; 
        }
        element.orderAsc = element.orderAsc != null ? !element.orderAsc : true;

        this.order.emit({ orderBy: element.orderBy!, orderAsc: element.orderAsc })
      }
    }
  }
}
