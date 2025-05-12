import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CategoryFormComponent } from './category-form.component';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { InputComponent } from '@app/components/atoms/input/input.component';

describe('CategoryFormComponent', () => {  
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let mockCategoryService: Partial<CategoryService>;
  let mockNotificationService: Partial<NotificationService>;
  let mockTranslatorService: Partial<TranslatorService>;

  beforeEach(async () => {
    // Mocks de servicios
    mockCategoryService = {
      createCategory: jest.fn().mockReturnValue(of({ message: 'Success' }))
    };

    mockNotificationService = {
      success: jest.fn(),
      error: jest.fn()
    };

    mockTranslatorService = {
      translate: jest.fn().mockImplementation((text) => text)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CategoryFormComponent, InputComponent], // Importar InputComponent
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: TranslatorService, useValue: mockTranslatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.categoryForm.value).toEqual({
        name: '',
        description: ''
      });
    });

    it('should have required validators', () => {
      const nameControl = component.nameControl;
      const descriptionControl = component.descriptionControl;

      nameControl.setValue('');
      descriptionControl.setValue('');

      expect(nameControl.valid).toBeFalsy();
      expect(descriptionControl.valid).toBeFalsy();
      expect(nameControl.errors?.['required']).toBeTruthy();
      expect(descriptionControl.errors?.['required']).toBeTruthy();
    });

    it('should have max length validators', () => {
      const longName = 'a'.repeat(51);
      const longDescription = 'a'.repeat(91);

      component.nameControl.setValue(longName);
      component.descriptionControl.setValue(longDescription);

      expect(component.nameControl.errors?.['maxlength']).toBeTruthy();
      expect(component.descriptionControl.errors?.['maxlength']).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should not call API when form is invalid', () => {
      component.submit();
      expect(mockCategoryService.createCategory).not.toHaveBeenCalled();
      expect(mockNotificationService.error).not.toHaveBeenCalled();
    });

    it('should mark all as touched when invalid form is submitted', () => {
      component.submit();
      expect(component.nameControl.touched).toBeTruthy();
      expect(component.descriptionControl.touched).toBeTruthy();
    });

    it('should call service when form is valid', () => {
      // Set valid values
      component.nameControl.setValue('Valid Name');
      component.descriptionControl.setValue('Valid Description');

      component.submit();

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith({
        name: 'Valid Name',
        description: 'Valid Description'
      });
    });

    it('should show success notification on successful submission', fakeAsync(() => {
      component.nameControl.setValue('Valid Name');
      component.descriptionControl.setValue('Valid Description');

      component.submit();
      tick(); // Para operaciones asíncronas

      expect(mockNotificationService.success).toHaveBeenCalledWith('Success');
      expect(component.categoryForm.pristine).toBeTruthy();
    }));

    it('should handle API errors', fakeAsync(() => {
      const errorResponse = { error: { message: 'Error message' } };
      mockCategoryService.createCategory = jest.fn().mockReturnValue(throwError(() => errorResponse));

      component.nameControl.setValue('Valid Name');
      component.descriptionControl.setValue('Valid Description');

      component.submit();
      tick();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Error message');
    }));
  });

  describe('UI Integration', () => {
    it('should disable submit button when form is invalid', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.nameControl.setValue('Valid Name');
      component.descriptionControl.setValue('Valid Description');
      fixture.detectChanges();
 
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalsy();
    });

    it('should bind form controls to app-input components', () => {
      const inputs = fixture.debugElement.queryAll(By.directive(InputComponent));
      expect(inputs.length).toBe(2);

      const nameInput = inputs[0].componentInstance as InputComponent;
      expect(nameInput.formControl).toBe(component.nameControl);
    });
  });
});