import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { CategoryFormComponent } from './category-form.component';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { InputComponent } from '@app/components/atoms/input/input.component';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let notificationService: jest.Mocked<NotificationService>;
  let translatorService: jest.Mocked<TranslatorService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CategoryFormComponent, InputComponent],
      providers: [
        FormBuilder,
        {
          provide: CategoryService,
          useValue: {
            createCategory: jest.fn()
          }
        },
        {
          provide: NotificationService,
          useValue: {
            success: jest.fn(),
            error: jest.fn()
          }
        },
        {
          provide: TranslatorService,
          useValue: {
            translate: jest.fn().mockImplementation(text => text)
          }
        }
      ]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    translatorService = TestBed.inject(TranslatorService) as jest.Mocked<TranslatorService>;

    categoryService.createCategory.mockReturnValue(of({ message: 'Success', time: '' }));

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
      expect(component.nameControl.errors?.['required']).toBeTruthy();
      expect(component.descriptionControl.errors?.['required']).toBeTruthy();
    });

    it('should have max length validators', () => {
      component.nameControl.setValue('a'.repeat(51));
      component.descriptionControl.setValue('a'.repeat(91));

      expect(component.nameControl.errors?.['maxlength']).toBeTruthy();
      expect(component.descriptionControl.errors?.['maxlength']).toBeTruthy();
    });

    it('should have correct control getters', () => {
      expect(component.nameControl).toBe(component.categoryForm.get('name'));
      expect(component.descriptionControl).toBe(component.categoryForm.get('description'));
    });
  });

  describe('Form Submission', () => {
    it('should not submit invalid form', () => {
      component.submit();
      expect(categoryService.createCategory).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched on invalid submission', () => {
      component.submit();
      expect(component.nameControl.touched).toBeTruthy();
      expect(component.descriptionControl.touched).toBeTruthy();
    });

    it('should call service with form value on valid submission', () => {
      component.nameControl.setValue('Test Category');
      component.descriptionControl.setValue('Test Description');
      
      component.submit();
      
      expect(categoryService.createCategory).toHaveBeenCalledWith({
        name: 'Test Category',
        description: 'Test Description'
      });
    });

    it('should handle successful submission', fakeAsync(() => {
      component.newCategory.emit = jest.fn();
      component.nameControl.setValue('Test Category');
      component.descriptionControl.setValue('Test Description');
      
      component.submit();
      tick();
      
      expect(notificationService.success).toHaveBeenCalledWith('Success');
      expect(component.categoryForm.pristine).toBeTruthy();
      expect(component.newCategory.emit).toHaveBeenCalledWith(true);
    }));

    it('should handle API errors', fakeAsync(() => {
      const errorResponse = { error: { message: 'API Error' } };
      categoryService.createCategory.mockReturnValue(throwError(() => errorResponse));
      
      component.nameControl.setValue('Test Category');
      component.descriptionControl.setValue('Test Description');
      
      component.submit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalledWith('API Error');
    }));

    it('should handle undefined error message', fakeAsync(() => {
      categoryService.createCategory.mockReturnValue(throwError(() => ({})));
      
      component.nameControl.setValue('Test Category');
      component.descriptionControl.setValue('Test Description');
      
      component.submit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalledWith('Ocurrió un error inesperado');
    }));
  });

  describe('UI Integration', () => {
    it('should have two app-input components', () => {
      const inputs = fixture.debugElement.queryAll(By.directive(InputComponent));
      expect(inputs.length).toBe(2);
    });

    it('should bind form controls to inputs', () => {
      const inputs = fixture.debugElement.queryAll(By.directive(InputComponent));
      const nameInput = inputs[0].componentInstance as InputComponent;
      const descInput = inputs[1].componentInstance as InputComponent;
      
      expect(nameInput.formControl).toBe(component.nameControl);
      expect(descInput.formControl).toBe(component.descriptionControl);
    });

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

    it('should emit newCategory event on success', fakeAsync(() => {
      jest.spyOn(component.newCategory, 'emit');
      
      component.nameControl.setValue('Valid Name');
      component.descriptionControl.setValue('Valid Description');
      component.submit();
      tick();
      
      expect(component.newCategory.emit).toHaveBeenCalledWith(true);
    }));
  });

  describe('Translation Service', () => {
    it('should translate success message', fakeAsync(() => {
      const testMessage = 'Translated success';
      translatorService.translate.mockReturnValue(testMessage);
      categoryService.createCategory.mockReturnValue(of({ message: 'Success', time: '' }));
      
      component.nameControl.setValue('Test');
      component.descriptionControl.setValue('Test');
      component.submit();
      tick();
      
      expect(translatorService.translate).toHaveBeenCalledWith('Success');
      expect(notificationService.success).toHaveBeenCalledWith(testMessage);
    }));

    it('should translate error message', fakeAsync(() => {
      const testMessage = 'Translated error';
      translatorService.translate.mockReturnValue(testMessage);
      categoryService.createCategory.mockReturnValue(throwError(() => ({ error: { message: 'Error' } })));
      
      component.nameControl.setValue('Test');
      component.descriptionControl.setValue('Test');
      component.submit();
      tick();
      
      expect(translatorService.translate).toHaveBeenCalledWith('Error');
      expect(notificationService.error).toHaveBeenCalledWith(testMessage);
    }));
  });
});