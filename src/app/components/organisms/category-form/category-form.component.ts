import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@app/core/models/category';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {

  public categoryForm: FormGroup;
  @Output() newCategory = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder, 
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private translatorService: TranslatorService
  ){ 
    this.categoryForm = this.fb.group ({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(90)]],
    });
  }

  get nameControl(): FormControl {
    return this.categoryForm.get('name') as FormControl;
  }
  
  get descriptionControl(): FormControl {
    return this.categoryForm.get('description') as FormControl;
  }  

  submit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.categoryService.createCategory(this.categoryForm.value as Category).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.categoryForm.reset();
        this.newCategory.emit(true);
      },
      error: (error) => {
        const message = error?.error?.message || 'Ocurrió un error inesperado';
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }
}
