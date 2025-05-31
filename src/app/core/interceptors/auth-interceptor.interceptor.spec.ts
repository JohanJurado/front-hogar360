import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { TokenService } from '../services/api/auth/token.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

// Mocks
class MockTokenService {
  isTokenExpired = jest.fn();
  removeToken = jest.fn();
  setRedirectUrl = jest.fn();
}

class MockRouter {
  url = '/current-route';
  navigate = jest.fn();
}

class MockHttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of(null as any);
  }
}

describe('AuthInterceptorInterceptor', () => {
  let interceptor: AuthInterceptorInterceptor;
  let tokenService: MockTokenService;
  let router: MockRouter;
  let httpHandler: MockHttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptorInterceptor,
        { provide: TokenService, useClass: MockTokenService },
        { provide: Router, useClass: MockRouter },
        { provide: HttpHandler, useClass: MockHttpHandler }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptorInterceptor);
    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    httpHandler = TestBed.inject(HttpHandler) as unknown as MockHttpHandler;
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept()', () => {
    const mockRequest = new HttpRequest('GET', '/api/data');
    const mockLoginRequest = new HttpRequest('JSONP', '/api/auth/login');

    it('should add Authorization header when token exists and request is not login', () => {
      // Arrange
      localStorage.setItem('authToken', 'valid.token.123');
      tokenService.isTokenExpired.mockReturnValue(false);
      jest.spyOn(httpHandler, 'handle').mockImplementation((req) => {
        expect(req.headers.get('Authorization')).toBe('Bearer valid.token.123');
        return of(null as any);
      });

      // Act & Assert 
      interceptor.intercept(mockRequest, httpHandler).subscribe();
    });

    it('should not add Authorization header for login request', () => {
      // Arrange
      localStorage.setItem('authToken', 'valid.token.123');
      jest.spyOn(httpHandler, 'handle').mockImplementation((req) => {
        expect(req.headers.has('Authorization')).toBe(false);
        return of(null as any);
      });

      // Act & Assert
      interceptor.intercept(mockLoginRequest, httpHandler).subscribe();
    });

    it('should handle expired token by redirecting to login', () => {
      // Arrange
      localStorage.setItem('authToken', 'expired.token.123');
      tokenService.isTokenExpired.mockReturnValue(true);

      // Act & Assert
      interceptor.intercept(mockRequest, httpHandler).subscribe({
        error: (err) => {
          expect(err.message).toBe('Token expired');
          expect(tokenService.removeToken).toHaveBeenCalled();
          expect(tokenService.setRedirectUrl).toHaveBeenCalledWith('/current-route');
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
        }
      });
    });

    it('should pass through request when no token exists', () => {
      // Arrange
      localStorage.removeItem('authToken');
      const handleSpy = jest.spyOn(httpHandler, 'handle').mockReturnValue(of(null as any));

      // Act & Assert
      interceptor.intercept(mockRequest, httpHandler).subscribe(() => {
        expect(handleSpy).toHaveBeenCalledWith(mockRequest);
      });
    });
  });
});