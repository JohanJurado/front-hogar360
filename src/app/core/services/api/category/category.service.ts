import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@app/core/models/category';
import { environment } from '@env/environment';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFTUFJTEFETUlOQEVNQUlMLkNPTSIsImlzcyI6IkJhY2tlbmRBcGlVc2VySG9nYXIzNjAiLCJpYXQiOjE3NDY4MTE4MDUsImV4cCI6MTc0NjgxOTAwNSwiYXV0aG9yaXRpZXMiOiJST0xFX0FETUlOIn0.IBLcHyHad_1EG3QtiReIARakjEjL7sCCAs0w1LHhqnk';

  constructor(private http: HttpClient) { }

  createCategory(categoryData: Category): Observable<SaveDtoResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<SaveDtoResponse>(`${environment.apiHomeUrl}/category/`, categoryData, { headers });
  }
}
