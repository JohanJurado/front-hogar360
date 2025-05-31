import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { User } from '@app/core/models/user';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUser = `${environment.apiUserUrl}/user/`;

  constructor(private readonly http: HttpClient) { }

  createSeller(userData: User): Observable<SaveDtoResponse> {
    return this.http.post<SaveDtoResponse>(this.apiUser, userData);
  }
}
