import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { HomeFilterFields } from '@app/core/models/dtos/homeFilterFields';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  page: number = PAGINATION_CONSTANTS.PAGE;
  size: number = PAGINATION_CONSTANTS.SIZE;
  orderBy: string = PAGINATION_CONSTANTS.ORDER_BY;
  orderAsc: boolean = PAGINATION_CONSTANTS.ORDER_ASC;
  totalItems: number = PAGINATION_CONSTANTS.TOTAL_ITEMS;

  modalFilterOptions = false;

  changeViewFilterOptions(){
    this.modalFilterOptions = !this.modalFilterOptions;
  }

  idDepartment: number = 0;
  idCity: number = 0;

  getHouseImage(index: number): string {
    return `./assets/img/card-house-icons/house-card-img-${(index % 3) + 1}.png`;
  }

  private readonly locationService = inject(LocationService);
  private readonly categoryService = inject(CategoryService);

  private readonly fb = inject(FormBuilder);
  public filterForm = this.fb.group({
    neighborhood: [''],
    nameCity: [''],
    nameDepartment: [''],
    nameCategory: [''],
    bedroomCount: [''],
    bathroomCount: [''],
    minPrice: [''],
    maxPrice: [''],
    orderBy: ['city'],
    orderAsc: ['true'],
  });

    houseService = inject(HouseService);
    houses$ = this.houseService.getHouses(this.filterForm.value as HomeFilterFields).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );

  get neighborhoodControl(): FormControl {
    return this.filterForm.get('neighborhood') as FormControl;
  }

  get nameCityControl(): FormControl {
    return this.filterForm.get('nameCity') as FormControl;
  }

  get nameDepartmentControl(): FormControl {
    return this.filterForm.get('nameDepartment') as FormControl;
  }

  get nameCategoryControl(): FormControl {
    return this.filterForm.get('nameCategory') as FormControl;
  }

  get bedroomCountControl(): FormControl {
    return this.filterForm.get('bedroomCount') as FormControl;
  }

  get bathroomCountControl(): FormControl {
    return this.filterForm.get('bathroomCount') as FormControl;
  }

  get minPriceControl(): FormControl {
    return this.filterForm.get('minPrice') as FormControl;
  }

  get maxPriceControl(): FormControl {
    return this.filterForm.get('maxPrice') as FormControl;
  }

  get orderByControl(): FormControl {
    return this.filterForm.get('orderBy') as FormControl;
  }

  get orderAscControl(): FormControl {
    return this.filterForm.get('orderAsc') as FormControl;
  }


  setDepartmentId(idDepartment: number): void{
    this.idDepartment = idDepartment;
  }

  setCityId(idCity:  number): void{
    this.idCity = idCity;
  }

  departmentExist(): boolean{
    if (this.idDepartment != 0){
      return false;
    } else {
      return true
    }
  }

  cityExist(): boolean{
    if (this.idCity != 0){
      return false;
    } else {
      return true
    }
  }

  getDepartments = (name: string): Observable<any[]> => {
    return this.locationService.getDepartments(name);
  }

  getCities = (name: string, idDepartment: number): Observable<any[]> => {
    return this.locationService.getCities(name, idDepartment);
  }

  getNeighborhoods = (name: string, idCity: number): Observable<any[]> => {
    return this.locationService.getNeighborhoods(name, idCity, this.idDepartment);
  }

  getCategories = (nameCategory: string): Observable<any[]> => {
      return this.categoryService.getCategories(
      PAGINATION_CONSTANTS.PAGE,
      PAGINATION_CONSTANTS.SIZE,
      PAGINATION_CONSTANTS.ORDER_ASC,
      nameCategory).pipe(
        map(response => {
          return response.content;
        })
      );
  }

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
    this.page = newPage;
    this.changeList();
  }

  newFilterValues(){
    if (this.filterForm.value.orderBy! != null){
      this.orderBy = this.filterForm.value.orderBy!;
    } else {
      this.orderBy = PAGINATION_CONSTANTS.ORDER_BY;
    }

    if (this.filterForm.value.orderAsc! != null){
      this.orderAsc = Boolean(this.filterForm.value.orderAsc);
    } else {
      this.orderAsc = PAGINATION_CONSTANTS.ORDER_ASC;
    }
    console.log(this.orderAsc);
    this.changeList();
    this.modalFilterOptions = false;
  }

  resetFilterForm(){
    this.filterForm.reset();
  }

  changeList(){
    this.houses$ = this.houseService.getHouses(this.filterForm.value as HomeFilterFields, this.page, this.size, this.orderBy, this.orderAsc).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );
  }

}
