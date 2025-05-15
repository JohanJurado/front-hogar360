import { Component } from '@angular/core';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent {
  page: number = 0;
  size: number = 10;
  orderAsc: boolean = true;
  totalItems: number = 0;

  categories$ = this.categoryService.getCategories(this.page, this.size, this.orderAsc).pipe(
    map(response => {
      this.totalItems = response.totalElements;
      console.log(response);
      return response.content;
    })
  );

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'id', prefix: 'CAT-2025', width: '120px' },
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
  ]

  constructor(
    private categoryService: CategoryService
  ){
  }

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
