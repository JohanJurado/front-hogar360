import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { House } from '@app/core/models/house';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private readonly token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTRUxMRVJAR01BSUwuQ09NIiwiaXNzIjoiQmFja2VuZEFwaVVzZXJIb2dhcjM2MCIsImlhdCI6MTc0ODE3OTY2MywiZXhwIjoxNzQ4MTg2ODYzLCJhdXRob3JpdGllcyI6IlJPTEVfU0VMTEVSIn0.OZ5-haH2KCMWptQd4kx_I2-XpVBZwxLwIwnLOz4HHtY';
  private readonly apiHomeHouse = `${environment.apiHomeUrl}/house/`;

  constructor(private readonly http: HttpClient) { }

  publishHouse(houseData: House): Observable<SaveDtoResponse> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<SaveDtoResponse>(this.apiHomeHouse, houseData, { headers });
  }
}
