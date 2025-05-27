import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '@app/core/models/city';
import { Department } from '@app/core/models/department';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Location } from '@app/core/models/location';
import { Pagination } from '@app/core/models/pagination';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly apiHomeLocation = `${environment.apiHomeUrl}/location/`;

  constructor(private readonly http: HttpClient) { }

  createLocation(locationData: Location): Observable<SaveDtoResponse> {
    locationData.descriptionDepartment = 'none';
    locationData.descriptionCity = 'none';

    return this.http.post<SaveDtoResponse>(this.apiHomeLocation, locationData);
  }

  getLocations(
    page: number = PAGINATION_CONSTANTS.PAGE, 
    size: number = PAGINATION_CONSTANTS.SIZE, 
    orderBy: string = PAGINATION_CONSTANTS.ORDER_BY, 
    orderAsc: boolean = PAGINATION_CONSTANTS.ORDER_ASC, 
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

  getNeighborhoods(nameNeighborhood: string, idCity: number, idDepartment: number): Observable<Location[]>{
    const params = new HttpParams()
      .set('nameNeighborhood', nameNeighborhood)
      .set('idCity', idCity)
      .set('idDepartment', idDepartment
    );

    return this.http.get<Location[]>(this.apiHomeLocation + 'get-neighborhoods', { params })
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
