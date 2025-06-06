import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Location } from '@app/core/models/location';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Pagination } from '@app/core/models/pagination';
import { City } from '@app/core/models/city';
import { Department } from '@app/core/models/department';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8081/api/location/';
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocationService,
        { provide: 'environment', useValue: { apiHomeUrl: 'http://localhost:8081/api' } },
        { provide: 'token', useValue: mockToken }
      ]
    });

    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createLocation()', () => {
    const mockLocation: Location = {
      nameDepartment: 'Test Dept',
      nameCity: 'Test City',
      neighborhood: 'Test Neighborhood',
      descriptionDepartment: '',
      descriptionCity: ''
    };

    it('should send POST request with authorization header', () => {
      const mockResponse: SaveDtoResponse = {
        time: '',
        message: 'Location created'
      };

      service.createLocation(mockLocation).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      
      expect(req.request.body.descriptionDepartment).toBe('none');
      expect(req.request.body.descriptionCity).toBe('none');

      req.flush(mockResponse);
    });

    it('should handle errors when creating location', () => {
      service.createLocation(mockLocation).subscribe({
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

  describe('getLocations()', () => {
    const mockLocations: Location[] = [
      { 
        nameDepartment: 'Dept 1', 
        nameCity: 'City 1', 
        neighborhood: 'Neighborhood 1',
        descriptionDepartment: 'none',
        descriptionCity: 'none'
      }
    ];

    const mockPaginationResponse: Pagination<Location> = {
      content: mockLocations,
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      last: true
    };

    it('should send GET request with default parameters', () => {
      service.getLocations().subscribe(response => {
        expect(response).toEqual(mockPaginationResponse);
      });

      const req = httpMock.expectOne(
        `${mockApiUrl}?nameLocation=&page=0&size=10&orderBy=city&orderAsc=true`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockPaginationResponse);
    });

    it('should send GET request with custom parameters', () => {
      service.getLocations(1, 5, 'name', false, 'test').subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}?nameLocation=test&page=1&size=5&orderBy=name&orderAsc=false`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockPaginationResponse);
    });

    it('should handle empty response', () => {
      const emptyResponse: Pagination<Location> = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true
      };

      service.getLocations().subscribe(response => {
        expect(response).toEqual(emptyResponse);
      });

      const req = httpMock.expectOne(req => req.url === mockApiUrl);
      req.flush(emptyResponse);
    });
  });

  describe('getCities()', () => {
    const mockCities: City[] = [
      { id: 1, name: 'City 1', description: '' },
      { id: 2, name: 'City 2', description: '' }
    ];

    it('should send GET request with city and department parameters', () => {
      service.getCities('test', 1).subscribe(response => {
        expect(response).toEqual(mockCities);
      });

      const req = httpMock.expectOne(
        `${mockApiUrl}get-cities?nameCity=test&idDepartment=1`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockCities);
    });

    it('should handle empty city name parameter', () => {
      service.getCities('', 1).subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}get-cities?nameCity=&idDepartment=1`
      );
      
      req.flush(mockCities);
    });
  });

  describe('getDepartments()', () => {
    const mockDepartments: Department[] = [
      { id: 1, name: 'Department 1', description: '' },
      { id: 2, name: 'Department 2', description: '' }
    ];

    it('should send GET request with department name parameter', () => {
      service.getDepartments('test').subscribe(response => {
        expect(response).toEqual(mockDepartments);
      });

      const req = httpMock.expectOne(
        `${mockApiUrl}get-departments?nameDepartment=test`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockDepartments);
    });

    it('should handle empty department name parameter', () => {
      service.getDepartments('').subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}get-departments?nameDepartment=`
      );
      
      req.flush(mockDepartments);
    });
  });

  describe('getNeighborhoods()', () => {
  const mockNeighborhoods: Location[] = [
    { 
      id: 1, 
      nameDepartment: 'Department 1', 
      nameCity: 'City 1', 
      neighborhood: 'Neighborhood 1',
      descriptionDepartment: '',
      descriptionCity: ''
    },
    { 
      id: 2, 
      nameDepartment: 'Department 1', 
      nameCity: 'City 1', 
      neighborhood: 'Neighborhood 2',
      descriptionDepartment: '',
      descriptionCity: ''
    }
  ];

  it('should send GET request with neighborhood, city and department parameters', () => {
    const testParams = {
      nameNeighborhood: 'test',
      idCity: 1,
      idDepartment: 2
    };

    service.getNeighborhoods(testParams.nameNeighborhood, testParams.idCity, testParams.idDepartment)
      .subscribe(response => {
        expect(response).toEqual(mockNeighborhoods);
      });

    const req = httpMock.expectOne(
      `${mockApiUrl}get-neighborhoods?nameNeighborhood=test&idCity=1&idDepartment=2`
    );
    
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('nameNeighborhood')).toBe('test');
    expect(req.request.params.get('idCity')).toBe('1');
    expect(req.request.params.get('idDepartment')).toBe('2');
    
    req.flush(mockNeighborhoods);
  });

  it('should handle empty neighborhood name parameter', () => {
    service.getNeighborhoods('', 1, 2).subscribe();

    const req = httpMock.expectOne(
      `${mockApiUrl}get-neighborhoods?nameNeighborhood=&idCity=1&idDepartment=2`
    );
    
    req.flush(mockNeighborhoods);
  });

  it('should handle error response', () => {
    service.getNeighborhoods('test', 1, 2).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(req => req.url === `${mockApiUrl}get-neighborhoods`);
    req.flush('Not Found', { 
      status: 404, 
      statusText: 'Not Found' 
    });
  });

  it('should return empty array when no neighborhoods found', () => {
    service.getNeighborhoods('test', 1, 2).subscribe(response => {
      expect(response).toEqual([]);
    });

    const req = httpMock.expectOne(req => req.url === `${mockApiUrl}get-neighborhoods`);
    req.flush([]);
  });
});
});