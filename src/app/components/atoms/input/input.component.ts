import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: 'text' | 'number' | 'textarea' | 'email' = 'text';
  @Input() placeholder: string = '';
  @Input() maxwidth: number = 90;
  @Input() showRequiredSymbol: boolean = true;
  @Input() formControl?: FormControl;
  @Input() disabled: boolean = false; // Cambiado a false por defecto

  private _value: string = '';
  
  get value(): any {
    if (this.disabled && this._value != '') {
      this._value = '';
      this.onChange(this._value);
      this.onTouched();
    }
    return this._value;
  }

  writeValue(name: string): void {
    this._value = name || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value = value;
    this.onChange(value);
    this.onTouched();
    console.log(value)
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  get count(): number {
    return this._value?.length || 0;
  }

  get errors() {
    return this.formControl?.errors;
  }

  getErrorMessage(): string {
    if (!this.errors) return '';
    
    if (this.errors['required']) return FORM_MESSAGES.REQUIRED;
    if (this.errors['maxlength']) return FORM_MESSAGES.MAX_LENGTH;
    return FORM_MESSAGES.INVALID;
  }
}