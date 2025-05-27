import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/api/auth/token.service';
import { NotificationService } from '../services/notification/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

    // Dentro de authGuard
  if (!tokenService.getToken()) {
    tokenService.setRedirectUrl(state.url); // Guarda la URL
    notificationService.error('Por favor inicia sesión');
    return router. parseUrl('/login');
  }

  if (tokenService.isTokenExpired()) {
    tokenService.removeToken(); // Limpia el token
    tokenService.setRedirectUrl(state.url);
    notificationService.error('Tu sesión ha expirado');
    return router.parseUrl('/login');
  }

  // 3. Verificación de roles (solo si la ruta los requiere)
  const requiredRoles = route.data?.['roles'] as Array<string>;
  
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = tokenService.getRole(); // string | null
    
    // Verifica si el usuario tiene UNO de los roles requeridos
    const hasRequiredRole = userRole && requiredRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      notificationService.error('No tienes permisos para acceder');
      return router.parseUrl('/login'); // Mejor: ruta específica
    }
  }

  return true; // Permite el acceso
};
