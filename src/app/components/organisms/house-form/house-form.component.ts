import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { House } from '@app/core/models/house';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'app-house-form',
  templateUrl: './house-form.component.html',
  styleUrls: ['./house-form.component.scss']
})
export class HouseFormComponent {

  public houseForm: FormGroup;
  idDepartment: number = 0;
  idCity: number = 0;

  constructor(
    private readonly fb: FormBuilder, 
    private readonly houseService: HouseService,
    private readonly locationService: LocationService,
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly translatorService: TranslatorService
  ){ 
    this.houseForm = this.fb.group ({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      bedroomCount: ['', [Validators.required]],
      bathroomCount: ['', [Validators.required]],
      price: ['', [Validators.required]],
      activePublicationDate: [null, [Validators.required, this.activeDateValidator]],
      categoryName: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      cityName: ['', [Validators.required]],
      departmentName: ['', [Validators.required]],
    });
  }

  activeDateValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= today && selectedDate <= maxDate ? null : { invalidActivePublicationDate: true };
  }

  setDepartmentId(idDepartment:  number): void{
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

  get nameControl(): FormControl {
    return this.houseForm.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.houseForm.get('description') as FormControl;
  }

  get bedroomCountControl(): FormControl {
    return this.houseForm.get('bedroomCount') as FormControl;
  }

  get bathroomCountControl(): FormControl {
    return this.houseForm.get('bathroomCount') as FormControl;
  }

  get priceControl(): FormControl {
    return this.houseForm.get('price') as FormControl;
  }

  get activePublicationDateControl(): FormControl {
    return this.houseForm.get('activePublicationDate') as FormControl;
  }

  get categoryNameControl(): FormControl {
    return this.houseForm.get('categoryName') as FormControl;
  }

  get neighborhoodControl(): FormControl {
    return this.houseForm.get('neighborhood') as FormControl;
  }

  get nameCityControl(): FormControl {
    return this.houseForm.get('cityName') as FormControl;
  }

  get nameDepartmentControl(): FormControl {
    return this.houseForm.get('departmentName') as FormControl;
  }

  submit(): void {
    if (this.houseForm.invalid) {
      this.houseForm.markAllAsTouched();
      return;
    }

    this.houseService.publishHouse(this.houseForm.value as House).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.houseForm.reset();
      },
      error: (error) => {
        const message = error?.error?.message ?? FORM_MESSAGES.ERROR;
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }

}
