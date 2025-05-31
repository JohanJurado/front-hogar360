import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(public jwtHelper: JwtHelperService) { }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  decodeToken() {
    const token = this.getToken();
    
    if (token) {
      try {
        return this.jwtHelper.decodeToken(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  getRole(): string | null {
    const decodedToken = this.decodeToken();
    if (decodedToken?.authorities) {
      let role: string | null = null;
      if (typeof decodedToken.authorities === 'string') {
        role = decodedToken.authorities;
      }
      
      if (role?.startsWith('ROLE_')) {
        return role.substring(5);
      }
    }
    return null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  private readonly REDIRECT_URL_KEY = 'redirect_url';

  setRedirectUrl(url: string): void {
    localStorage.setItem(this.REDIRECT_URL_KEY, url);
  }

  getRedirectUrl(): string | null {
    return localStorage.getItem(this.REDIRECT_URL_KEY);
  }

  clearRedirectUrl(): void {
    localStorage.removeItem(this.REDIRECT_URL_KEY);
  }
}
