import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { HomeFilterFields } from '@app/core/models/dtos/homeFilterFields';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  private readonly houseService = inject(HouseService);
  private readonly locationService = inject(LocationService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  page = PAGINATION_CONSTANTS.PAGE;
  size = PAGINATION_CONSTANTS.SIZE;
  totalItems = PAGINATION_CONSTANTS.TOTAL_ITEMS;
  modalFilterOptions = false;
  idDepartment = 0;
  idCity = 0;

  filterForm = this.fb.group({
    nameDepartment: [''],
    nameCity: [''],
    neighborhood: [''],
    nameCategory: [''],
    bedroomCount: [''],
    bathroomCount: [''],
    minPrice: [''],
    maxPrice: [''],
    orderBy: ['city'],
    orderAsc: ['true']
  });

  houses$ = this.houseService.getHouses(this.filterForm.value as HomeFilterFields).pipe(
    map(response => {
      this.totalItems = response.totalElements;
      return response.content;
    })
  );

  getDepartments = (name: string) => this.locationService.getDepartments(name);
  getCities = (name: string, id: number) => this.locationService.getCities(name, id);
  getNeighborhoods = (name: string, id: number) => this.locationService.getNeighborhoods(name, id, this.idDepartment);
  getCategories = (name: string) => this.categoryService.getCategories(
    PAGINATION_CONSTANTS.PAGE,
    PAGINATION_CONSTANTS.SIZE,
    PAGINATION_CONSTANTS.ORDER_ASC,
    name
  ).pipe(map(response => response.content));

  toggleFilterModal() {
    this.modalFilterOptions = !this.modalFilterOptions;
  }

  applyFilters() {
    this.page = 0;
    this.modalFilterOptions = false
    this.loadHouses();
  }

  resetFilters() {
    this.filterForm.reset({
      orderBy: 'city',
      orderAsc: 'true'
    });
    this.idDepartment = 0;
    this.idCity = 0;
    this.applyFilters();
  }

  setDepartmentId(id: number) {
    this.idDepartment = id;
    this.filterForm.get('nameCity')?.reset();
    this.filterForm.get('neighborhood')?.reset();
    this.idCity = 0;
  }

  setCityId(id: number) {
    this.idCity = id;
    this.filterForm.get('neighborhood')?.reset();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadHouses();
  }

  loadHouses() {
    this.houses$ = this.houseService.getHouses(
      this.filterForm.value as HomeFilterFields,
      this.page,
      this.size,
      this.filterForm.value.orderBy ?? 'city',
      this.filterForm.value.orderAsc === 'true'
    ).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );
  }
}