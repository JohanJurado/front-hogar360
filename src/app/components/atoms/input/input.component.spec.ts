import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators, FormsModule, NgControl } from '@angular/forms';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [InputComponent],
      providers: [
        {
          provide: NgControl,
          useValue: {
            control: new FormControl('', Validators.required)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should write value correctly', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should register onChange function', () => {
      const fn = jest.fn();
      component.registerOnChange(fn);
      component.onChange('test');
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched function', () => {
      const fn = jest.fn();
      component.registerOnTouched(fn);
      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });

    it('should clear value when disabled and has value', () => {
      component.onChange = jest.fn();
      component.writeValue('test value');
      component.disabled = true;
      const value = component.value;
      expect(value).toBe('');
      expect(component.onChange).toHaveBeenCalledWith('');
    });
  });

  describe('User Interaction', () => {
    it('should update value on input event', () => {
      component.onChange = jest.fn();
      const input = fixture.debugElement.query(By.css('input'));
      const testValue = 'new input';
      
      input.triggerEventHandler('input', { target: { value: testValue } });
      expect(component.value).toBe(testValue);
      expect(component.onChange).toHaveBeenCalledWith(testValue);
    });

    it('should call onTouched on blur event', () => {
      const input = fixture.debugElement.query(By.css('input'));
      jest.spyOn(component, 'onTouched');
      
      input.triggerEventHandler('blur', null);
      expect(component.onTouched).toHaveBeenCalled();
    });
  });

  describe('UI Rendering', () => {
    it('should display correct label', () => {
      const testLabel = 'Test Label';
      component.label = testLabel;
      fixture.detectChanges();
      
      const label = fixture.debugElement.query(By.css('.label__text'));
      expect(label.nativeElement.textContent.trim()).toContain(testLabel);
    });

    it('should show/hide required symbol based on input', () => {
      component.showRequiredSymbol = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.label__required-simbol'))).toBeTruthy();

      component.showRequiredSymbol = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.label__required-simbol'))).toBeNull();
    });

    it('should render textarea when type is textarea', () => {
      component.type = 'textarea';
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('textarea'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('input'))).toBeNull();
    });

    it('should render different input types', () => {
      const types = ['text', 'number', 'email'];
      
      types.forEach(type => {
        component.type = type as any;
        fixture.detectChanges();
        
        const input = fixture.debugElement.query(By.css('input'));
        expect(input.nativeElement.type).toBe(type);
      });
    });
  });

  describe('Form Validation', () => {
    it('should display error message when control is invalid and touched', () => {
      const control = new FormControl('', Validators.required);
      component.formControl = control;
      control.markAsTouched();
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.input-error small'));
      expect(error.nativeElement.textContent).toContain(FORM_MESSAGES.REQUIRED);
    });

    it('should not display error message when control is pristine', () => {
      const control = new FormControl('', Validators.required);
      component.formControl = control;
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.input-error small'));
      expect(error).toBeNull();
    });

    it('should display maxlength error when exceeding limit', () => {
      const control = new FormControl('123456', Validators.maxLength(5));
      component.formControl = control;
      control.markAsTouched();
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.input-error small'));
      expect(error.nativeElement.textContent).toContain(FORM_MESSAGES.MAX_LENGTH);
    });
  });

  describe('Character Count', () => {
    it('should display correct character count', () => {
      component.writeValue('test');
      component.maxwidth = 10;
      fixture.detectChanges();

      const count = fixture.debugElement.query(By.css('.input-count'));
      expect(count.nativeElement.textContent.trim()).toBe('4/10');
    });

    it('should add red class when exceeding maxwidth', () => {
      component.writeValue('this is a long text');
      component.maxwidth = 5;
      fixture.detectChanges();

      const count = fixture.debugElement.query(By.css('.input-count'));
      expect(count.nativeElement.classList.contains('red')).toBeTruthy();
    });

    it('should not add red class when under maxwidth', () => {
      component.writeValue('short');
      component.maxwidth = 10;
      fixture.detectChanges();

      const count = fixture.debugElement.query(By.css('.input-count'));
      expect(count.nativeElement.classList.contains('red')).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('should not break when formControl is not provided', () => {
      component.formControl = undefined;
      fixture.detectChanges();

      expect(() => {
        component.getErrorMessage();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should return default invalid message', () => {
      const control = new FormControl('', () => ({ invalid: true }));
      control.markAsTouched();
      component.formControl = control;
      
      expect(component.getErrorMessage()).toBe(FORM_MESSAGES.INVALID);
      });
  });

  describe('Error Messages', () => {
  it('should return email error message', () => {
    const control = new FormControl('invalid-email', Validators.email);
    control.markAsTouched();
    component.formControl = control;
    
    expect(component.getErrorMessage()).toBe(FORM_MESSAGES.EMAIL);
  });

  it('should return phone number error message', () => {
    const control = new FormControl('', { 
      validators: [() => ({ invalidPhoneNumber: true })] 
    });
    control.markAsTouched();
    component.formControl = control;
    
    expect(component.getErrorMessage()).toBe(FORM_MESSAGES.PHONE_NUMBER);
  });

  it('should return birthdate error message', () => {
    const control = new FormControl('', { 
      validators: [() => ({ underAge: true })] 
    });
    control.markAsTouched();
    component.formControl = control;
    
    expect(component.getErrorMessage()).toBe(FORM_MESSAGES.BIRTHDATE);
  });

  it('should return password error message', () => {
    const control = new FormControl('', { 
      validators: [() => ({ invalidPassword: true })] 
    });
    control.markAsTouched();
    component.formControl = control;
    
    expect(component.getErrorMessage()).toBe(FORM_MESSAGES.PASSWORD);
  });

  it('should return active publication date error message', () => {
    const control = new FormControl('', { 
      validators: [() => ({ invalidActivePublicationDate: true })] 
    });
    control.markAsTouched();
    component.formControl = control;
    
    expect(component.getErrorMessage()).toBe(FORM_MESSAGES.ACTIVE_PUBLICATION_DATE);
  });
});
});