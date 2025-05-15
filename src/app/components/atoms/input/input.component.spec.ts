import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 1. Test para ControlValueAccessor
  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should register onChange', () => {
      const fn = jest.fn();
      component.registerOnChange(fn);
      component.onChange('new value');
      expect(fn).toHaveBeenCalledWith('new value');
    });

    it('should register onTouched', () => {
      const fn = jest.fn();
      component.registerOnTouched(fn);
      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });
  });

  // 2. Test para interacción del usuario
  describe('User Interaction', () => {
    it('should update value on input', () => {
      const input = fixture.debugElement.query(By.css('input'));
      jest.spyOn(component, 'onChange');
      
      input.triggerEventHandler('input', { target: { value: 'new' } });
      expect(component.value).toBe('new');
      expect(component.onChange).toHaveBeenCalledWith('new');
    });

    it('should call onTouched on blur', () => {
      const input = fixture.debugElement.query(By.css('input'));
      jest.spyOn(component, 'onTouched');
      
      input.triggerEventHandler('blur', null);
      expect(component.onTouched).toHaveBeenCalled();
    });
  });

  // 3. Test para visualización
  describe('UI Rendering', () => {
    it('should show label', () => {
      component.label = 'Test Label';
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('.label__text'));
      expect(label.nativeElement.textContent).toContain('Test Label');
    });

    it('should show required symbol when enabled', () => {
      component.showRequiredSymbol = true;
      fixture.detectChanges();
      const symbol = fixture.debugElement.query(By.css('.label__required-simbol'));
      expect(symbol).toBeTruthy();
    });

    it('should hide required symbol when disabled', () => {
      component.showRequiredSymbol = false;
      fixture.detectChanges();
      const symbol = fixture.debugElement.query(By.css('.label__required-simbol'));
      expect(symbol).toBeNull();
    });

    it('should render textarea when type is textarea', () => {
      component.type = 'textarea';
      fixture.detectChanges();
      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea).toBeTruthy();
    });
  });

  // 4. Test para validaciones y errores
  describe('Validation', () => {
    it('should show error message when invalid and touched', () => {
      const control = new FormControl('', Validators.required);
      component.formControl = control;
      control.markAsTouched();
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.input-error'));
      expect(error.nativeElement.textContent).toContain('Este campo es obligatorio');
    });

    it('should show character count', () => {
      component.value = 'test';
      component.maxwidth = 10;
      fixture.detectChanges();

      const count = fixture.debugElement.query(By.css('.input-count'));
      expect(count.nativeElement.textContent).toBe(' 4/10 ');
    });

    it('should add red class when over maxwidth', () => {
      component.value = 'this is a long text';
      component.maxwidth = 5;
      fixture.detectChanges();

      const count = fixture.debugElement.query(By.css('.input-count'));
      expect(count.nativeElement.classList).toContain('red');
    });
  });
});