import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Visit } from '@app/core/models/visit';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly apiVisit = `${environment.apiVisitUrl}/visit/`;

  constructor(private readonly http: HttpClient) { }

  createVisit(visitData: Visit): Observable<SaveDtoResponse> {
    return this.http.post<SaveDtoResponse>(this.apiVisit, visitData);
  }
}
