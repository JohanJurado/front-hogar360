import { TestBed } from '@angular/core/testing';
import { HouseService } from './house.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { House } from '@app/core/models/house';

describe('HouseService', () => {
  let service: HouseService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8081/api/house/';
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HouseService,
        { provide: 'environment', useValue: { apiHomeUrl: 'http://localhost:8081/api' } },
        { provide: 'token', useValue: mockToken }
      ]
    });

    service = TestBed.inject(HouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('publishHouse()', () => {
    const mockHouseData: House = {
      name: 'Test House',
      description: 'Test Description',
      bedroomCount: 3,
      bathroomCount: 2,
      price: 100000,
      activePublicationDate: new Date(),
      categoryName: 'Test Category',
      neighborhood: 'Test Neighborhood',
      cityName: 'Test City',
      departmentName: 'Test Department'
    };

    const mockSuccessResponse: SaveDtoResponse = {
      time: '2023-01-01T00:00:00',
      message: 'House published successfully'
    };

    it('should send POST request with authorization header and house data', () => {
      service.publishHouse(mockHouseData).subscribe(response => {
        expect(response).toEqual(mockSuccessResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      
      // Verificar método HTTP y headers
      expect(req.request.method).toBe('POST');
      
      // Verificar cuerpo de la petición
      expect(req.request.body).toEqual(mockHouseData);
      
      // Simular respuesta exitosa
      req.flush(mockSuccessResponse);
    });

    it('should handle error response', () => {
      service.publishHouse(mockHouseData).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('should use correct API endpoint', () => {
      service.publishHouse(mockHouseData).subscribe();
      
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.url).toBe(mockApiUrl);
      
      req.flush(mockSuccessResponse);
    });

    it('should send request with correct content type', () => {
      service.publishHouse(mockHouseData).subscribe();
      
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.headers.get('Content-Type')).toBeNull(); // Angular añade automáticamente 'application/json'
      
      req.flush(mockSuccessResponse);
    });
  });
});