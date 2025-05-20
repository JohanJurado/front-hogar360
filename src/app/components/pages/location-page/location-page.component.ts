import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { LocationService } from '@app/core/services/api/location/location.service';
import { delay, map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss']
})
export class LocationPageComponent {
  page: number = 0;
  size: number = 10;
  totalItems: number = 0;

  private fb = inject(FormBuilder);
  public filterForm = this.fb.group({
    nameFilter: ['', [Validators.required]],
    orderAsc: ['true', [Validators.required]],
    orderBy: ['city', [Validators.required]],
  });

  get nameFilter(): FormControl {
    return this.filterForm.get('nameFilter') as FormControl;
  }
  
  get orderAsc(): FormControl {
    return this.filterForm.get('orderAsc') as FormControl;
  }

  get orderBy(): FormControl {
    return this.filterForm.get('orderBy') as FormControl;
  }

  orderOptions(term: string): Observable<any[]> {
    const mockProducts = [
      { name: 'true' },
      { name: 'false' },
    ];
    
    return of(
      mockProducts.filter(option => 
        option.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  orderByOptions(term: string): Observable<any[]> {
    const mockProducts = [
      { name: 'city' },
      { name: 'department' },
    ];
    
    return of(
      mockProducts.filter(option => 
        option.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  private LocationService = inject(LocationService);

  reloadLocationList(){
    this.onPageChange(this.page);
  }

  locations$ = this.LocationService.getLocations(this.page, this.size, this.orderBy.value, Boolean(this.orderAsc.value)).pipe(
    map(response => {
      this.totalItems = response.totalElements;
      return response.content;
    })
  );

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'id', prefix: 'LOC-2025', width: '120px' },
    { key: 'nameDepartment', title: 'Nombre Departamento' },
    { key: 'nameCity', title: 'Nombre Ciudad' },
    { key: 'neighborhood', title: 'Barrio/Sector' },
  ]

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.locations$ = this.LocationService.getLocations(this.page, this.size, this.orderBy.value, Boolean(this.orderAsc.value), this.nameFilter.value).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );
  }
}
