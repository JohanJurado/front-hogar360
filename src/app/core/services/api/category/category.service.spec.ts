import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Category } from '@app/core/models/category';
import { Pagination } from '@app/core/models/pagination';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8081/api/category/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService,
        { provide: 'environment', useValue: { apiHomeUrl: 'http://localhost:8081/api' } }
      ]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createCategory()', () => {
    const mockCategory: Category = {
      name: 'Test Category',
      description: 'Test Description'
    };

    it('should return response data on success', () => {
      const mockResponse = { success: true, id: 1 };

      service.createCategory(mockCategory).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush(mockResponse);
    });

    it('should handle errors', () => {
      service.createCategory(mockCategory).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });
  });

  describe('getCategories()', () => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Category 1', description: 'Desc 1' },
      { id: 2, name: 'Category 2', description: 'Desc 2' }
    ];

    const mockPaginationResponse: Pagination<Category> = {
      content: mockCategories,
      pageNumber: 0,
      pageSize: 2,
      totalElements: 10,
      totalPages: 5,
      last: false
    };

    it('should send GET request with custom parameters', () => {
      service.getCategories(1, 5, false, 'test').subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}?nameCategory=test&page=1&size=5&orderAsc=false`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockPaginationResponse);
    });

    it('should return paginated categories on success', () => {
      service.getCategories().subscribe(response => {
        expect(response).toEqual(mockPaginationResponse);
      });

      const req = httpMock.expectOne(req => req.url === mockApiUrl);
      req.flush(mockPaginationResponse);
    });

    it('should handle empty response', () => {
      const emptyResponse: Pagination<Category> = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true
      };

      service.getCategories().subscribe(response => {
        expect(response).toEqual(emptyResponse);
      });

      const req = httpMock.expectOne(req => req.url === mockApiUrl);
      req.flush(emptyResponse);
    });

    it('should handle errors when fetching categories', () => {
      service.getCategories().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(req => req.url === mockApiUrl);
      req.flush('Not Found', { 
        status: 404, 
        statusText: 'Not Found' 
      });
    });
  });

});