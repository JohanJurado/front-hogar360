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

  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFTUFJTEFETUlOQEVNQUlMLkNPTSIsImlzcyI6IkJhY2tlbmRBcGlVc2VySG9nYXIzNjAiLCJpYXQiOjE3NDgwMzAwODksImV4cCI6MTc0ODAzNzI4OSwiYXV0aG9yaXRpZXMiOiJST0xFX0FETUlOIn0.SUdzlA4Wsdszpus4Xnah8ev5a45UzuR75SOREUIJlsc';
  private apiUser = `${environment.apiUserUrl}/user/`;

  constructor(private http: HttpClient) { }

  createSeller(userData: User): Observable<SaveDtoResponse> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<SaveDtoResponse>(this.apiUser, userData, { headers });
  }
}
