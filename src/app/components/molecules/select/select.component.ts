import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent  implements ControlValueAccessor{
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() service!: (name: string, id: number) => Observable<any[]>;
  @Input() formControl?: FormControl;
  @Input() idObject: number = 0;
  @Input() required: boolean = true;
  @Input() disabled: boolean = this.idObject == 0;
  
  displayField: string = 'name';

  @Output() getId = new EventEmitter<number>();
  filteredOptions: any[] = [];
  isOpen: boolean = false;

  private _value: string = '';
  public _selectedOption: any = null;

  writeValue(name: string): void {
    this._value = name || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  handleInputEvent(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value = value;
    this.onSearchChange(value);
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  onFocus(): void {
    if (!this.isOpen) {
      this.isOpen = true;
      this.onSearchChange(this._value);
    }
    this.onTouched();
  }

  onSearchChange(name: string): void {
    this.service(name, this.idObject).subscribe({
      next: (options) => {
        this.filteredOptions = options;
        this.isOpen = true;
          
        const exactMatch = options.find(opt => 
          opt[this.displayField] === name.toUpperCase()
        );
        if (exactMatch) {
          this.getId.emit(exactMatch.id);
        } else {
          this.getId.emit(0);
        }

        this._value = name;
        this.onChange(this._value);
        this.onTouched();
      },
      error: () => {
        this.isOpen = false;
        this.filteredOptions = [];
      }
    });
  }

  selectOption(option: any): void {
    this._selectedOption = option;
    this._value = option.name;
    this.onChange(option.name);
    this.onTouched();
    this.getId.emit(option.id);
    this.isOpen = false;
    this.filteredOptions = [];
  }

  get value(): any {
    if (this.disabled && this._value != '') {
      this._value = '';
      this.onChange(this._value);
      this.onTouched();
      this.getId.emit(0);
    }
    return this._value;
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