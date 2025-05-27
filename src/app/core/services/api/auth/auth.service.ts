import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '@app/core/models/dtos/loginRequest';
import { LoginResponse } from '@app/core/models/dtos/loginResponse';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private readonly apiUser = `${environment.apiUserUrl}/auth/login`;
  
    constructor(private readonly http: HttpClient) { }
  
    login(loginData: LoginRequest): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(this.apiUser, loginData);
    }
}
