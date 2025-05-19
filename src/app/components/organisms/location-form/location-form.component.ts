import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@app/core/models/location';
import { LocationService } from '@app/core/services/api/location/location.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {

  public locationForm: FormGroup;
  @Output() newLocation = new EventEmitter<boolean>();
  
  idDepartment: number = 0;
  idCity: number = 0;

  constructor(
    private fb: FormBuilder, 
    private locationService: LocationService,
    private notificationService: NotificationService,
    private translatorService: TranslatorService
  ){ 
    this.locationForm = this.fb.group ({
      nameDepartment: ['', [Validators.required, Validators.maxLength(50)]],
      nameCity: ['', [Validators.required, Validators.maxLength(50)]],
      neighborhood: ['', [Validators.required, Validators.maxLength(120)]],
    });
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

  get departmentNameControl(): FormControl {
    return this.locationForm.get('nameDepartment') as FormControl;
  }
  
  get cityNameControl(): FormControl {
    return this.locationForm.get('nameCity') as FormControl;
  }  

  get neighborhoodControl(): FormControl {
    return this.locationForm.get('neighborhood') as FormControl;
  }  

  submit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }
    console.log(this.locationForm.value);

    this.locationService.createLocation(this.locationForm.value as Location).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.locationForm.reset();
        this.newLocation.emit(true);
      },
      error: (error) => {
        const message = error?.error?.message || 'Ocurrió un error inesperado';
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }
}
