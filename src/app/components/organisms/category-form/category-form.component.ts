import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  public categoryForm: FormGroup = new FormGroup ({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  onChangeCategoryForm(value: string, key: string): void{
    const updateRow: { [key: string]: string} = {}
    updateRow[key] = value;
    this.categoryForm.patchValue(updateRow);
  }

  submit(): void {
    console.log(this.categoryForm.value);
  }
}
