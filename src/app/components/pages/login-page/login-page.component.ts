import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '@app/core/models/dtos/loginRequest';
import { AuthService } from '@app/core/services/api/auth/auth.service';
import { TokenService } from '@app/core/services/api/auth/token.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  loginForm: FormGroup;

  public readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly translatorService = inject(TranslatorService);

  constructor(){ 
    this.loginForm = this.fb.group ({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
    
  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.loginForm.reset();
        localStorage.setItem('authToken', response.jwt);
        
        let redirectUrl = this.tokenService.getRedirectUrl() ?? '';
        
        if (redirectUrl == ''){
          if (this.tokenService.getRole() == 'ADMIN'){
            redirectUrl = '/admin/dashboard';
          } else {
            redirectUrl = this.tokenService.getRole() == 'SELLER' ? '/seller/dashboard' : '';
          }
        }

        this.tokenService.clearRedirectUrl();
        this.router.navigateByUrl(redirectUrl);
      },
      error: (error) => {
        const message = error?.error?.message ?? FORM_MESSAGES.ERROR;
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }
}
