import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { User } from '@app/core/models/user';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFTUFJTEFETUlOQEVNQUlMLkNPTSIsImlzcyI6IkJhY2tlbmRBcGlVc2VySG9nYXIzNjAiLCJpYXQiOjE3NDc5NDc3NTksImV4cCI6MTc0Nzk1NDk1OSwiYXV0aG9yaXRpZXMiOiJST0xFX0FETUlOIn0.yEeHlgo_FPUqXhYSAQ2uwGKuYtT5zKISO3bKumLm9Vo';
  private apiUser = `${environment.apiUserUrl}/user/`;

  constructor(private http: HttpClient) { }

  createSeller(userData: User): Observable<SaveDtoResponse> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<SaveDtoResponse>(this.apiUser, userData, { headers });
  }
}
