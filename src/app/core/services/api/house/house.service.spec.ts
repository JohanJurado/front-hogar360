import { TestBed } from '@angular/core/testing';
import { HouseService } from './house.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { House } from '@app/core/models/house';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Pagination } from '@app/core/models/pagination';
import { HomeFilterFields } from '@app/core/models/dtos/homeFilterFields';

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
    httpMock.verify();
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
      
      expect(req.request.method).toBe('POST');
      
      expect(req.request.body).toEqual(mockHouseData);
      
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
  });

  describe('getHouses()', () => {
    const mockHouses: House[] = [
      {
        id: 1,
        name: 'House 1',
        description: 'Description 1',
        bedroomCount: 2,
        bathroomCount: 1,
        price: 50000,
        activePublicationDate: new Date(),
        categoryName: 'Category 1',
        neighborhood: 'Neighborhood 1',
        cityName: 'City 1',
        departmentName: 'Department 1'
      }
    ];

    const mockPaginationResponse: Pagination<House> = {
      content: mockHouses,
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      last: true
    };

    it('should send GET request with default parameters', () => {
      service.getHouses().subscribe(response => {
        expect(response).toEqual(mockPaginationResponse);
      });

      const req = httpMock.expectOne(
        `${mockApiUrl}?filterBySeller=false&neighborhood=&nameCity=&nameDepartment=&nameCategory=&bedroomCount=&bathroomCount=&minPrice=&maxPrice=&page=0&size=10&orderBy=city&orderAsc=true`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.toString()).toContain('orderBy=city');
      
      req.flush(mockPaginationResponse);
    });

    it('should send GET request with custom filters and pagination', () => {
      const filters: HomeFilterFields = {
        neighborhood: 'Test',
        nameCity: 'City',
        minPrice: 100000,
        maxPrice: 200000
      };

      service.getHouses(filters, false, 2, 5, 'price', false).subscribe();

      const req = httpMock.expectOne(
        req => req.url === mockApiUrl &&
          req.params.get('neighborhood') === 'Test' &&
          req.params.get('nameCity') === 'City' &&
          req.params.get('minPrice') === '100000' &&
          req.params.get('maxPrice') === '200000' &&
          req.params.get('page') === '2' &&
          req.params.get('size') === '5' &&
          req.params.get('orderBy') === 'price' &&
          req.params.get('orderAsc') === 'false'
      );
      
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginationResponse);
    });

    it('should handle empty response', () => {
      const emptyResponse: Pagination<House> = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true
      };

      service.getHouses().subscribe(response => {
        expect(response).toEqual(emptyResponse);
      });

      const req = httpMock.expectOne(req => req.url === mockApiUrl);
      req.flush(emptyResponse);
    });

    it('should handle null filter values', () => {
      const filters: HomeFilterFields = {
        neighborhood: null as any,
        nameCity: undefined as any
      };

      service.getHouses(filters).subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}?filterBySeller=false&neighborhood=&nameCity=&nameDepartment=&nameCategory=&bedroomCount=&bathroomCount=&minPrice=&maxPrice=&page=0&size=10&orderBy=city&orderAsc=true`
      );
      
      expect(req.request.params.get('neighborhood')).toBe('');
      expect(req.request.params.get('nameCity')).toBe('');
      req.flush(mockPaginationResponse);
    });
  });
});