import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {

  public locationForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    //private categoryService: CategoryService,
    private notificationService: NotificationService,
    private translatorService: TranslatorService
  ){ 
    this.locationForm = this.fb.group ({
      departmentName: ['', [Validators.required, Validators.maxLength(50)]],
      cityName: ['', [Validators.required, Validators.maxLength(50)]],
      neighborhood: ['', [Validators.required, Validators.maxLength(120)]],
    });
  }

  listaDePrueba = [
    {id: 1, name: 'departamento 1', description: 'description'},
    {id: 2, name: 'departamento 2', description: 'description'},
    {id: 3, name: 'departamento 3', description: 'description'},
    {id: 4, name: 'departamento 4', description: 'description'},
    {id: 5, name: 'departamento 5', description: 'description'},
  ]

  get departmentNameControl(): FormControl {
    return this.locationForm.get('departmentName') as FormControl;
  }
  
  get cityNameControl(): FormControl {
    return this.locationForm.get('cityName') as FormControl;
  }  

  get neighborhoodControl(): FormControl {
    return this.locationForm.get('neighborhood') as FormControl;
  }  

  submit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    /*
    this.categoryService.createCategory(this.categoryForm.value as Category).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message) || 'Guardado Exitoso');
        console.log(response.message);
        this.categoryForm.reset();
      },
      error: (error) => {
        const message = error?.error?.message || 'Ocurrió un error inesperado';
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
    */
  }
}
