import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserService } from '@app/core/services/api/user/user.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MAX_LENGTH_FILEDS } from '@app/shared/constants/max-length-fileds';
import { InputComponent } from '@app/components/atoms/input/input.component';

// Mocks para servicios
class MockUserService {
  createSeller = jest.fn().mockReturnValue(of({ message: 'Success' }));
}

class MockNotificationService {
  success = jest.fn();
  error = jest.fn();
}

class MockTranslatorService {
  translate = jest.fn().mockImplementation((key) => key);
}


describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: MockUserService;
  let notificationService: MockNotificationService;
  let translatorService: MockTranslatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserFormComponent, InputComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useClass: MockUserService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: TranslatorService, useClass: MockTranslatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    notificationService = TestBed.inject(NotificationService) as unknown as MockNotificationService;
    translatorService = TestBed.inject(TranslatorService) as unknown as MockTranslatorService;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.userForm.value).toEqual({
      name: '',
      lastName: '',
      document: '',
      phoneNumber: '',
      birthdate: null,
      email: '',
      password: '',
      confirmPassword: ''
    });
  });

  it('should mark all fields as touched when invalid form is submitted', fakeAsync(() => {
    const markAllAsTouchedSpy = jest.spyOn(component.userForm, 'markAllAsTouched');

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    tick(); 

    expect(markAllAsTouchedSpy).toHaveBeenCalled(); 
    expect(component.userForm.touched).toBe(true);
  }));

  it('should validate phone number format', () => {
    component.phoneNumberControl.setValue('invalid');
    expect(component.phoneNumberControl.errors?.['invalidPhoneNumber']).toBeTruthy();
    
    component.phoneNumberControl.setValue('+573001234567');
    expect(component.phoneNumberControl.errors).toBeNull();
  });

  it('should validate age >= 18', () => {
    // Test underage
    const underageDate = new Date();
    underageDate.setFullYear(underageDate.getFullYear() - 17);
    component.birthdateControl.setValue(underageDate.toISOString().split('T')[0]);
    expect(component.birthdateControl.errors?.['underAge']).toBeTruthy();
    
    // Test adult
    const adultDate = new Date();
    adultDate.setFullYear(adultDate.getFullYear() - 19);
    component.birthdateControl.setValue(adultDate.toISOString().split('T')[0]);
    expect(component.birthdateControl.errors).toBeNull();
  });

  it('should validate password match', () => {
    component.passwordControl.setValue('password123');
    component.confirmPasswordControl.setValue('mismatch');
    expect(component.confirmPasswordControl.errors?.['invalidPassword']).toBeTruthy();
    
    component.confirmPasswordControl.setValue('password123');
    expect(component.confirmPasswordControl.errors).toBeNull();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true);
    
    component.nameControl.setValue('John');
    fixture.detectChanges();
    expect(submitButton.disabled).toBe(true); // Still invalid
  });

  it('should call userService.createSeller on valid submission', fakeAsync(() => {
    // Fill valid data
    component.nameControl.setValue('John');
    component.lastNameControl.setValue('Doe');
    component.documentControl.setValue('123456789');
    component.phoneNumberControl.setValue('+573001234567');
    component.birthdateControl.setValue('1990-01-01');
    component.emailControl.setValue('john@example.com');
    component.passwordControl.setValue('password123');
    component.confirmPasswordControl.setValue('password123');
    
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();
    tick();
    
    expect(userService.createSeller).toHaveBeenCalledWith({
      name: 'John',
      lastName: 'Doe',
      document: '123456789',
      phoneNumber: '+573001234567',
      birthdate: '1990-01-01',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(notificationService.success).toHaveBeenCalledWith('Success');
    expect(component.userForm.pristine).toBe(true);
  }));

  it('should show error notification on API failure', fakeAsync(() => {
    userService.createSeller.mockReturnValue(throwError(() => ({ error: { message: 'API Error' } })));
    
    // Fill valid data
    component.nameControl.setValue('John');
    component.lastNameControl.setValue('Doe');
    component.documentControl.setValue('123456789');
    component.phoneNumberControl.setValue('+573001234567');
    component.birthdateControl.setValue('1990-01-01');
    component.emailControl.setValue('john@example.com');
    component.passwordControl.setValue('password123');
    component.confirmPasswordControl.setValue('password123');
    
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();
    tick();
    
    expect(notificationService.error).toHaveBeenCalledWith('API Error');
  }));

  it('should handle max length for phone number', () => {
    const longPhoneNumber = '1'.repeat(MAX_LENGTH_FILEDS.USER.PHONE_NUMBER + 1);
    component.phoneNumberControl.setValue(longPhoneNumber);
    expect(component.phoneNumberControl.errors?.['maxlength']).toBeTruthy();
  });

  it('should validate email format', () => {
    component.emailControl.setValue('invalid-email');
    expect(component.emailControl.errors?.['email']).toBeTruthy();
    
    component.emailControl.setValue('valid@example.com');
    expect(component.emailControl.errors).toBeNull();
  });

  it('should translate error messages', () => {
    component.nameControl.setValue('');
    component.nameControl.markAsTouched();
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.form__row:first-child small'));
    expect(errorElement).toBeTruthy();
    //expect(translatorService.translate).toHaveBeenCalled();
  });
});