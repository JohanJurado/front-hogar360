import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '@app/core/models/city';
import { Department } from '@app/core/models/department';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Location } from '@app/core/models/location';
import { Pagination } from '@app/core/models/pagination';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFTUFJTEFETUlOQEVNQUlMLkNPTSIsImlzcyI6IkJhY2tlbmRBcGlVc2VySG9nYXIzNjAiLCJpYXQiOjE3NDc3NzkwMzcsImV4cCI6MTc0Nzc4NjIzNywiYXV0aG9yaXRpZXMiOiJST0xFX0FETUlOIn0.fVH-PeRhhXKSR4qsA5ntFRZEVKWXA76wy1ONBXqVSqQ';
  private apiHomeLocation = `${environment.apiHomeUrl}/location/`;

  constructor(private http: HttpClient) { }

  createLocation(locationData: Location): Observable<SaveDtoResponse> {
    locationData.descriptionDepartment = 'none';
    locationData.descriptionCity = 'none';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<SaveDtoResponse>(this.apiHomeLocation, locationData, { headers });
  }

  getLocations(
    page: number = 0, 
    size: number = 10, 
    orderBy: string = 'city', 
    orderAsc: boolean = true, 
    nameLocation: string = ''
  ): Observable<Pagination<Location>> {

    const params = new HttpParams()
      .set('nameLocation', nameLocation)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('orderBy', orderBy.toString())
      .set('orderAsc', orderAsc.toString()
    );
      
    return this.http.get<Pagination<Location>>(this.apiHomeLocation, { params });
  }

  getCities(nameCity: string, idDepartment: number): Observable<City[]>{
    const params = new HttpParams()
      .set('nameCity', nameCity)
      .set('idDepartment', idDepartment
    );

    return this.http.get<City[]>(this.apiHomeLocation + 'get-cities', { params })
  }

  getDepartments(nameDepartment: string): Observable<Department[]>{
    const params = new HttpParams()
      .set('nameDepartment', nameDepartment
    );

    return this.http.get<Department[]>(this.apiHomeLocation + 'get-departments', { params })
  }
}
