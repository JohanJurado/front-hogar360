import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/api/auth/token.service';
import { NotificationService } from '../services/notification/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (!tokenService.getToken()) {
    tokenService.setRedirectUrl(state.url);
    notificationService.error('Por favor inicia sesión');
    return router. parseUrl('/login');
  }

  if (tokenService.isTokenExpired()) {
    tokenService.removeToken();
    tokenService.setRedirectUrl(state.url);
    notificationService.error('Tu sesión ha expirado');
    return router.parseUrl('/login');
  }

  const requiredRoles = route.data?.['roles'] as Array<string>;
  
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = tokenService.getRole();
    
    const hasRequiredRole = userRole && requiredRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      notificationService.error('No tienes permisos para acceder a esta ruta');      
      
      return router.parseUrl('/' + userRole?.toLowerCase() + '/dashboard');
    }
  }

  return true;
};
