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

  getSchedulers(
    page: number = PAGINATION_CONSTANTS.PAGE, 
    size: number = PAGINATION_CONSTANTS.SIZE, 
    startDate: string | null = null,
    endDate: string | null = null,
    idHouse: number = 0,
  ): Observable<Pagination<Scheduler>> {

    let params = new HttpParams()
      .set('idHouse', idHouse.toString())
      .set('page', page.toString())
      .set('size', size.toString()
    );

    if (startDate != null){      
      params = params.set('startDate', startDate);
    }
    if (endDate != null){
      params = params.set('endDate', endDate);    
    }
      
    return this.http.get<Pagination<Scheduler>>(this.apiVisitScheduler, { params });
  }
}
