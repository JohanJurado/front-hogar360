import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';

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
export class SelectComponent {
  @Input() placeholder: string = '';
  @Input() displayField: string = 'name';
  @Input() service: (term: string) => Observable<any[]> = () => of([]);
  @Input() debounceTime: number = 300;
  @Input() minLength: number = 2;
  @Input() formControl!: FormControl;
  @Input() required: boolean = false;
  
  @Output() selected = new EventEmitter<any>();
  
  options: any[] = [];
  filteredOptions: any[] = [];
  searchTerm: string = '';
  isOpen: boolean = false;
  isLoading: boolean = false;
  isDisabled: boolean = false;
  
  // ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};
  private _value: any;

  ngOnInit() {
    if (this.formControl) {
      this.formControl.valueChanges.subscribe(value => {
        this.writeValue(value);
      });
    }
  }

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  get errors() {
    return this.formControl?.errors;
  }

  onInputChange(term: string): void {
    this.searchTerm = term;
    
    if (term.length >= this.minLength) {
      this.isLoading = true;
      this.service(term).subscribe({
        next: (data) => {
          this.options = data;
          this.filteredOptions = data;
          this.isOpen = true;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.isOpen = false;
        }
      });
    } else {
      this.filteredOptions = [];
      this.isOpen = false;
    }
  }

  selectOption(option: any): void {
    this.value = option;
    this.searchTerm = option[this.displayField];
    this.selected.emit(option);
    this.isOpen = false;
  }

  // ControlValueAccessor methods
  writeValue(obj: any): void {
    if (obj) {
      this._value = obj;
      this.searchTerm = typeof obj === 'object' ? obj[this.displayField] : obj;
    } else {
      this._value = null;
      this.searchTerm = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
    this.isOpen = false;
  }

}
