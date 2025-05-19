import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@app/core/models/category';
import { environment } from '@env/environment';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Pagination } from '@app/core/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFTUFJTEFETUlOQEVNQUlMLkNPTSIsImlzcyI6IkJhY2tlbmRBcGlVc2VySG9nYXIzNjAiLCJpYXQiOjE3NDc2MDI1MDcsImV4cCI6MTc0NzYwOTcwNywiYXV0aG9yaXRpZXMiOiJST0xFX0FETUlOIn0.QR3leBbqJTmqgJ99Z_WnhZe1qvvvwK8jpPIHY3wy5Zw';
  private apiHomeCategory = `${environment.apiHomeUrl}/category/`;

  constructor(private http: HttpClient) { }

  createCategory(categoryData: Category): Observable<SaveDtoResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<SaveDtoResponse>(this.apiHomeCategory, categoryData, { headers });
  }

  getCategories(
    page: number = 0, 
    size: number = 10, 
    orderAsc: boolean = true, 
    nameCategory: string = ''
  ): Observable<Pagination<Category>> {

    const params = new HttpParams()
      .set('nameCategory', nameCategory)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('orderAsc', orderAsc.toString()
    );
      
    return this.http.get<Pagination<Category>>(this.apiHomeCategory, { params });
  }
}
