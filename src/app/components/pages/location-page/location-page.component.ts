import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { LocationService } from '@app/core/services/api/location/location.service';
import { MAX_LENGTH_FILEDS } from '@app/shared/constants/max-length-fileds';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';
import { map } from 'rxjs';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss']
})
export class LocationPageComponent {
  page: number = PAGINATION_CONSTANTS.PAGE;
  size: number = PAGINATION_CONSTANTS.SIZE;
  orderBy: string = PAGINATION_CONSTANTS.ORDER_BY;
  orderAsc: boolean = PAGINATION_CONSTANTS.ORDER_ASC;
  totalItems: number = PAGINATION_CONSTANTS.TOTAL_ITEMS;

  columns: TableColumn[] = TABLE_COLUMNS.LOCATIONS as TableColumn[];

  private readonly LocationService = inject(LocationService);
  locations$ = this.LocationService.getLocations(this.page, this.size, this.orderBy, this.orderAsc).pipe(
    map(response => {
      this.totalItems = response.totalElements;
      return response.content;
    })
  );

  private readonly fb = inject(FormBuilder);
  public filterForm = this.fb.group({
    nameFilter: ['', [Validators.maxLength(MAX_LENGTH_FILEDS.LOCATION.NAME_CITY)]],
  });

  get nameFilter(): FormControl {
    return this.filterForm.get('nameFilter') as FormControl;
  }

  onOrderChange(order: { orderBy: string, orderAsc: boolean }){
    this.orderBy = order.orderBy;
    this.orderAsc = order.orderAsc;
    this.onListChange();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.onListChange();
  }

  onListChange(): void {
    this.locations$ = this.LocationService.getLocations(this.page, this.size, this.orderBy, this.orderAsc, this.nameFilter.value).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );
  }
}
