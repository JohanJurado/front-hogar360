import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Category } from '@app/core/models/category';

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

    it('should send POST request to correct endpoint', () => {
      // Act
      service.createCategory(mockCategory).subscribe();

      // Assert
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCategory);
      
      // Simular respuesta exitosa
      req.flush({ success: true });
    });

    it('should return response data on success', () => {
      const mockResponse = { success: true, id: 1 };

      // Act & Assert
      service.createCategory(mockCategory).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush(mockResponse);
    });

    it('should handle errors', () => {
      // Act & Assert
      service.createCategory(mockCategory).subscribe({
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
});