import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '@app/core/services/api/auth/auth.service';
import { TokenService } from '@app/core/services/api/auth/token.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';

const mockAuthService = {
  login: jest.fn()
};

const mockTokenService = {
  getRedirectUrl: jest.fn(),
  clearRedirectUrl: jest.fn(),
  getRole: jest.fn()
};

const mockNotificationService = {
  success: jest.fn(),
  error: jest.fn()
};

const mockTranslatorService = {
  translate: jest.fn().mockImplementation((key) => key)
};

const mockRouter = {
  navigateByUrl: jest.fn()
};

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        LoginPageComponent,
        SelectComponent,
        InputComponent 
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: TranslatorService, useValue: mockTranslatorService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize login form with empty values', () => {
      expect(component.loginForm.value).toEqual({
        email: '',
        password: ''
      });
    });

    it('should have required validators', () => {
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');

      emailControl?.setValue('');
      passwordControl?.setValue('');

      expect(emailControl?.valid).toBeFalsy();
      expect(passwordControl?.valid).toBeFalsy();
      expect(component.loginForm.invalid).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should not call authService if form is invalid', () => {
      component.loginForm.setValue({
        email: '',
        password: ''
      });
      
      component.submit();
      
      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(component.loginForm.touched).toBeTruthy();
    });

    it('should call authService.login with form values when valid', () => {
      const testCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      component.loginForm.setValue(testCredentials);
      mockAuthService.login.mockReturnValue(of({}));
      
      component.submit();
      
      expect(mockAuthService.login).toHaveBeenCalledWith(testCredentials);
    });
  });

  describe('Successful Login', () => {
    const mockResponse = {
      message: 'Login successful',
      jwt: 'mock-jwt-token'
    };

    beforeEach(() => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123'
      });
      mockAuthService.login.mockReturnValue(of(mockResponse));
    });

    it('should handle successful login response', fakeAsync(() => {
      component.submit();
      tick();
      
      expect(localStorage.getItem('authToken')).toBe(mockResponse.jwt);
      expect(mockNotificationService.success).toHaveBeenCalledWith(mockResponse.message);
      expect(component.loginForm.value).toEqual({ email: null, password: null });
    }));

    it('should navigate to redirectUrl if exists', fakeAsync(() => {
      const testUrl = '/previous-page';
      mockTokenService.getRedirectUrl.mockReturnValue(testUrl);
      
      component.submit();
      tick();
      
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(testUrl);
      expect(mockTokenService.clearRedirectUrl).toHaveBeenCalled();
    }));

    it('should navigate to admin dashboard for ADMIN role', fakeAsync(() => {
      mockTokenService.getRedirectUrl.mockReturnValue('');
      mockTokenService.getRole.mockReturnValue('ADMIN');
      
      component.submit();
      tick();
      
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/admin/dashboard');
    }));

    it('should navigate to seller dashboard for SELLER role', fakeAsync(() => {
      mockTokenService.getRedirectUrl.mockReturnValue('');
      mockTokenService.getRole.mockReturnValue('SELLER');
      
      component.submit();
      tick();
      
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/seller/dashboard');
    }));
  });

  describe('Failed Login', () => {
    it('should handle login error with specific message', fakeAsync(() => {
      const errorResponse = { error: { message: 'Invalid credentials' } };
      mockAuthService.login.mockReturnValue(throwError(() => errorResponse));
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrongpass'
      });
      
      component.submit();
      tick();
      
      expect(mockNotificationService.error).toHaveBeenCalledWith('Invalid credentials');
    }));

    it('should handle login error with default message', fakeAsync(() => {
      mockAuthService.login.mockReturnValue(throwError(() => ({})));
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrongpass'
      });
      
      component.submit();
      tick();
      
      expect(mockNotificationService.error).toHaveBeenCalledWith('Ocurrió un error inesperado');
    }));
  });

  describe('UI Interactions', () => {
    it('should disable submit button when form is invalid', () => {
      component.loginForm.setValue({
        email: '',
        password: ''
      });
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123'
      });
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });
  });
});