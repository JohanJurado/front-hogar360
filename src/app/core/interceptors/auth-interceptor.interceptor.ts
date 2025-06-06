import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/api/auth/token.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('authToken');
    const isLoginRequest = request.url.includes('/api/auth/login');

    if (authToken && !isLoginRequest) {
      
      if (this.tokenService.isTokenExpired()) {
        this.tokenService.setRedirectUrl(this.router.url);
        this.tokenService.removeToken();
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token expired'));
      }

      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}
