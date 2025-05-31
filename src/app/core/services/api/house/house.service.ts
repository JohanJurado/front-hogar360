import { HttpClient, HttpParams } from '@angular/common/http';
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

  private readonly apiHomeHouse = `${environment.apiHomeUrl}/house/`;

  constructor(private readonly http: HttpClient) { }

  publishHouse(houseData: House): Observable<SaveDtoResponse> {
    return this.http.post<SaveDtoResponse>(this.apiHomeHouse, houseData);
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
