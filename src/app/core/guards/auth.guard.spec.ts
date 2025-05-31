import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/api/auth/token.service';
import { NotificationService } from '../services/notification/notification.service';
import { authGuard } from './auth.guard';
import { runInInjectionContext } from '@angular/core';

// Mocks (se mantienen igual)
class MockTokenService {
  getToken = jest.fn();
  isTokenExpired = jest.fn();
  removeToken = jest.fn();
  setRedirectUrl = jest.fn();
  getRole = jest.fn();
}

class MockRouter {
  parseUrl = jest.fn((url: string) => new UrlTree());
}

class MockNotificationService {
  error = jest.fn();
}

describe('authGuard', () => {
  let tokenService: MockTokenService;
  let router: MockRouter;
  let notificationService: MockNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useClass: MockTokenService },
        { provide: Router, useClass: MockRouter },
        { provide: NotificationService, useClass: MockNotificationService }
      ]
    });

    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    notificationService = TestBed.inject(NotificationService) as unknown as MockNotificationService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const executeGuard = (routeData: any, routerStateUrl: string) => {
    return runInInjectionContext(TestBed, () => {
      return authGuard(
        { data: routeData } as any,
        { url: routerStateUrl } as any
      );
    });
  };

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  describe('when no token exists', () => {
    it('should redirect to login with notification', () => {
      // Arrange
      tokenService.getToken.mockReturnValue(null);
      const mockUrl = '/protected-route';

      // Act
      const result = executeGuard({}, mockUrl);

      // Assert
      expect(result instanceof UrlTree).toBe(true);
      expect(router.parseUrl).toHaveBeenCalledWith('/login');
      expect(tokenService.setRedirectUrl).toHaveBeenCalledWith(mockUrl);
      expect(notificationService.error).toHaveBeenCalledWith('Por favor inicia sesión');
    });
  });

  // Resto de las pruebas usando executeGuard en lugar de llamar directamente a authGuard
  describe('when token is expired', () => {
    it('should remove token and redirect to login', () => {
      // Arrange
      tokenService.getToken.mockReturnValue('expired.token');
      tokenService.isTokenExpired.mockReturnValue(true);
      const mockUrl = '/protected-route';

      // Act
      const result = executeGuard({}, mockUrl);

      // Assert
      expect(result instanceof UrlTree).toBe(true);
      expect(tokenService.removeToken).toHaveBeenCalled();
      expect(tokenService.setRedirectUrl).toHaveBeenCalledWith(mockUrl);
      expect(notificationService.error).toHaveBeenCalledWith('Tu sesión ha expirado');
      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('when token is valid', () => {
    beforeEach(() => {
      tokenService.getToken.mockReturnValue('valid.token');
      tokenService.isTokenExpired.mockReturnValue(false);
    });

    it('should allow access when no roles are required', () => {
      // Act
      const result = executeGuard({}, '/any-route');

      // Assert
      expect(result).toBe(true);
    });

    it('should allow access when user has required role', () => {
      // Arrange
      tokenService.getRole.mockReturnValue('ADMIN');

      // Act
      const result = executeGuard({ roles: ['ADMIN', 'EDITOR'] }, '/admin-route');

      // Assert
      expect(result).toBe(true);
    });

    it('should deny access when user lacks required role', () => {
      // Arrange
      tokenService.getRole.mockReturnValue('USER');
      const mockUrl = '/admin-route';

      // Act
      const result = executeGuard({ roles: ['ADMIN'] }, mockUrl);

      // Assert
      expect(result instanceof UrlTree).toBe(true);
      expect(notificationService.error).toHaveBeenCalledWith('No tienes permisos para acceder a esta ruta');
      expect(router.parseUrl).toHaveBeenCalledWith('/user/dashboard');
    });
  });
});