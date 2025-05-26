import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeFilterFields } from '@app/core/models/dtos/homeFilterFields';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { House } from '@app/core/models/house';
import { Pagination } from '@app/core/models/pagination';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
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

    getHouses(
      homeFilterFields: HomeFilterFields = {},
      page: number = PAGINATION_CONSTANTS.PAGE, 
      size: number = PAGINATION_CONSTANTS.SIZE, 
      orderBy: string = PAGINATION_CONSTANTS.ORDER_BY, 
      orderAsc: boolean = PAGINATION_CONSTANTS.ORDER_ASC, 
    ): Observable<Pagination<House>> {
  
      const params = new HttpParams()
        .set('neighborhood', homeFilterFields.neighborhood ?? '')
        .set('nameCity', homeFilterFields.nameCity ?? '')
        .set('nameDepartment', homeFilterFields.nameDepartment ?? '')
        .set('nameCategory', homeFilterFields.nameCategory ?? '')
        .set('bedroomCount', homeFilterFields.bedroomCount ?? '')
        .set('bathroomCount', homeFilterFields.bathroomCount ?? '')
        .set('minPrice', homeFilterFields.minPrice ?? '')
        .set('maxPrice', homeFilterFields.maxPrice ?? '')
        .set('page', page.toString())
        .set('size', size.toString())
        .set('orderBy', orderBy.toString())
        .set('orderAsc', orderAsc.toString()
      );
        
      return this.http.get<Pagination<House>>(this.apiHomeHouse, { params });
    }
}
