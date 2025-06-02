import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Pagination } from '@app/core/models/pagination';
import { Scheduler } from '@app/core/models/scheduler';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  private readonly apiVisitScheduler = `${environment.apiVisitUrl}/scheduler/`;

  constructor(private readonly http: HttpClient) { }

  createScheduler(schedulerData: Scheduler): Observable<SaveDtoResponse> {
    return this.http.post<SaveDtoResponse>(this.apiVisitScheduler, schedulerData);
  }

  // getSchedulers(
  //   startDate: Date,
  //   endDate: Date,
  //   idHouse: number,
  //   page: number = PAGINATION_CONSTANTS.PAGE, 
  //   size: number = PAGINATION_CONSTANTS.SIZE, 
  // ): Observable<Pagination<Scheduler>> {

  //   const params = new HttpParams()
  //     .set('startDate', startDate.toString())
  //     .set('endDate', endDate.toString())
  //     .set('idHouse', idHouse.toString())
  //     .set('page', page.toString())
  //     .set('size', size.toString()
  //   );
      
  //   return this.http.get<Pagination<Scheduler>>(this.apiVisitScheduler, { params });
  // }
}
