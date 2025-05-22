import { Component } from '@angular/core';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';
import { map } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent {
  page: number = PAGINATION_CONSTANTS.PAGE;
  size: number = PAGINATION_CONSTANTS.SIZE;
  orderAsc: boolean = PAGINATION_CONSTANTS.ORDER_ASC;
  totalItems: number = PAGINATION_CONSTANTS.TOTAL_ITEMS;

  columns: TableColumn[] = TABLE_COLUMNS.CATEGORY as TableColumn[];

  constructor(
    private categoryService: CategoryService
  ){
  }

  reloadCategoryList(){
    this.onPageChange(this.page);
  }

  categories$ = this.categoryService.getCategories(this.page, this.size, this.orderAsc).pipe(
    map(response => {
      this.totalItems = response.totalElements;
      return response.content;
    })
  );

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.categories$ = this.categoryService.getCategories(this.page, this.size).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );
  }
}
