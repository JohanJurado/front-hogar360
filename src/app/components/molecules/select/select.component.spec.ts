import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { FormControl, ReactiveFormsModule, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from '@app/shared/directives/click-outside.directive';
import { Directive, EventEmitter, Output } from '@angular/core';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirectiveMock {
  @Output() clickOutside = new EventEmitter<void>();
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let mockService: jest.Mock;

  beforeEach(async () => {
    mockService = jest.fn();
    
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SelectComponent, ClickOutsideDirective],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: SelectComponent,
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    
    // Mock del servicio
    component.service = mockService.mockImplementation((name: string, id: number) => {
      return of([{id: 1, name: 'Option 1'}, {id: 2, name: 'Option 2'}]);
    });
    
    // Mock ControlValueAccessor
    component.onChange = jest.fn();
    component.onTouched = jest.fn();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('Test Value');
      expect(component.value).toBe('Test Value');
    });

    it('should register onChange and onTouched', () => {
      const changeFn = jest.fn();
      const touchedFn = jest.fn();
      
      component.registerOnChange(changeFn);
      component.registerOnTouched(touchedFn);
      
      component.onChange('test');
      component.onTouched();
      
      expect(changeFn).toHaveBeenCalledWith('test');
      expect(touchedFn).toHaveBeenCalled();
    });
  });

  describe('User Interaction', () => {
    it('should open dropdown on focus', () => {
      const input = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('focus', null);
      
      expect(component.isOpen).toBe(true);
      expect(mockService).toHaveBeenCalled();
    });

    it('should close dropdown on clickOutside', () => {
      component.isOpen = true;
      component.closeDropdown();
      
      expect(component.isOpen).toBe(false);
    });

    it('should select option and emit event', fakeAsync(() => {
    // 1. Configura el estado necesario
    const testOption = {id: 1, name: 'Option 1'};
    component.filteredOptions = [testOption];
    component.isOpen = true; // Asegura que el dropdown esté abierto
    
    // 2. Dispara el cambio de detección
    fixture.detectChanges();
    tick(); // Para operaciones asíncronas
    
    // 3. Busca el elemento en el DOM
    const option = fixture.debugElement.query(By.css('.option-item'));
    expect(option).not.toBeNull(); // Verifica que existe antes de interactuar
    
    // 4. Prepara los spies
    jest.spyOn(component, 'onChange');
    jest.spyOn(component.getId, 'emit');
    
    // 5. Dispara el evento
    option.triggerEventHandler('mousedown', { 
      preventDefault: jest.fn() // Mock para preventDefault si es necesario
    });
    
    // 6. Verifica los resultados
    expect(component._selectedOption).toEqual(testOption);
    expect(component.onChange).toHaveBeenCalledWith(testOption.name);
    expect(component.getId.emit).toHaveBeenCalledWith(1);
  }));

    it('should handle input changes', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('input', {target: {value: 'test'}});
      
      tick(300); // Debounce time
      
      expect(mockService).toHaveBeenCalledWith('test', 0);
      expect(component.filteredOptions.length).toBeGreaterThan(0);
    }));
  });

  describe('Service Integration', () => {
    it('should call service with empty string on focus', () => {
      component.onFocus();
      expect(mockService).toHaveBeenCalledWith('', 0);
    });

    it('should handle service errors', fakeAsync(() => {
      mockService.mockReturnValue(throwError(() => new Error('Service error')));
      component.onSearchChange('test');
      tick();
      
      expect(component.isOpen).toBe(false);
      expect(component.filteredOptions).toEqual([]);
    }));

    it('should emit id when exact match found', fakeAsync(() => {
      jest.spyOn(component.getId, 'emit');
      mockService.mockReturnValue(of([{id: 1, name: 'TEST'}]));
      
      component.onSearchChange('TEST');
      tick();
      
      expect(component.getId.emit).toHaveBeenCalledWith(1);
    }));
  });

  describe('Form Validation', () => {
    it('should show error when invalid and touched', () => {
      const control = new FormControl('', Validators.required);
      component.formControl = control;
      control.markAsTouched();
      fixture.detectChanges();
      
      const error = fixture.debugElement.query(By.css('.input-error small'));
      expect(error).toBeTruthy();
    });

    it('should not show error when dropdown is open', () => {
      const control = new FormControl('', Validators.required);
      component.formControl = control;
      component.isOpen = true;
      control.markAsTouched();
      fixture.detectChanges();
      
      const error = fixture.debugElement.query(By.css('.input-error small'));
      expect(error).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('should clear value when disabled', () => {
      component.onChange = jest.fn();
      component.getId.emit = jest.fn();
      component.writeValue('Test Value');
      component.disabled = true;
      
      const value = component.value;
      expect(value).toBe('');
      expect(component.onChange).toHaveBeenCalledWith('');
      expect(component.getId.emit).toHaveBeenCalledWith(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search term', fakeAsync(() => {
      component.onSearchChange('');
      tick();
      
      expect(mockService).toHaveBeenCalledWith('', 0);
    }));

    it('should handle service errors and close dropdown', fakeAsync(() => {
      // Mock servicio para que falle
      mockService.mockReturnValue(throwError(() => new Error('Test Error')));
      
      component.onSearchChange('test');
      tick(); // Procesa el observable
      
      expect(component.isOpen).toBe(false);
      expect(component.filteredOptions).toEqual([]);
    }));

    describe('Error Messages', () => {
    it('should return empty string when no errors', () => {
      component.formControl = new FormControl();
      expect(component.getErrorMessage()).toBe('');
    });

    it('should return required message', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      component.formControl = control;
      
      expect(component.getErrorMessage()).toBe(FORM_MESSAGES.REQUIRED);
    });

    it('should return maxlength message', () => {
      const control = new FormControl('123456', Validators.maxLength(5));
      control.markAsTouched();
      component.formControl = control;
      
      expect(component.getErrorMessage()).toBe(FORM_MESSAGES.MAX_LENGTH);
    });

    it('should return default invalid message', () => {
      const control = new FormControl('', () => ({ invalid: true }));
      control.markAsTouched();
      component.formControl = control;
      
      expect(component.getErrorMessage()).toBe(FORM_MESSAGES.INVALID);
      });
    });
  });
});