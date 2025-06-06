import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchedulerService } from './scheduler.service';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Pagination } from '@app/core/models/pagination';
import { Scheduler } from '@app/core/models/scheduler';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8088/api/scheduler/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchedulerService,
        { provide: 'environment', useValue: { apiVisitUrl: 'http://localhost:8088/api' } }
      ]
    });

    service = TestBed.inject(SchedulerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createScheduler', () => {
    it('should send POST request with scheduler data', () => {
      const mockScheduler: Scheduler = {
        idHouse: 1,
        startDate: '2025-01-01T10:00:00',
        endDate: '2025-01-01T12:00:00'
      };

      const mockResponse: SaveDtoResponse = {
        time: '',
        message: 'Scheduler created successfully'
      };

      service.createScheduler(mockScheduler).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockScheduler);
      
      req.flush(mockResponse);
    });

    it('should handle errors when creating scheduler', () => {
      const mockScheduler: Scheduler = {
        idHouse: 1,
        startDate: '2025-01-01T10:00:00',
        endDate: '2025-01-01T12:00:00'
      };

      service.createScheduler(mockScheduler).subscribe({
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

  describe('getSchedulers', () => {
    const mockSchedulers: Scheduler[] = [
      { idHouse: 1, startDate: '2025-01-01T10:00:00', endDate: '2025-01-01T12:00:00' },
      { idHouse: 1, startDate: '2025-01-02T10:00:00', endDate: '2025-01-02T12:00:00' }
    ];

    const mockPaginationResponse: Pagination<Scheduler> = {
      content: mockSchedulers,
      totalElements: 10,
      totalPages: 2,
      pageSize: PAGINATION_CONSTANTS.SIZE,
      pageNumber: PAGINATION_CONSTANTS.PAGE,
      last: false
    };

    it('should send GET request with default parameters', () => {
      service.getSchedulers().subscribe(response => {
        expect(response).toEqual(mockPaginationResponse);
      });

      const req = httpMock.expectOne(
        `${mockApiUrl}?idHouse=0&page=${PAGINATION_CONSTANTS.PAGE}&size=${PAGINATION_CONSTANTS.SIZE}`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockPaginationResponse);
    });

    it('should send GET request with custom parameters', () => {
      const page = 2;
      const size = 5;
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      const idHouse = 5;

      service.getSchedulers(page, size, startDate, endDate, idHouse).subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}?idHouse=5&page=2&size=5&startDate=2025-01-01&endDate=2025-01-31`
      );
      expect(req.request.method).toBe('GET');
      
      req.flush(mockPaginationResponse);
    });

    it('should handle empty response', () => {
      const emptyResponse: Pagination<Scheduler> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageSize: PAGINATION_CONSTANTS.SIZE,
        pageNumber: PAGINATION_CONSTANTS.PAGE,
        last: true
      };

      service.getSchedulers().subscribe(response => {
        expect(response).toEqual(emptyResponse);
      });

      const req = httpMock.expectOne(req => req.url === mockApiUrl);
      req.flush(emptyResponse);
    });

    it('should handle errors when fetching schedulers', () => {
      service.getSchedulers().subscribe({
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

    it('should not include date params when null', () => {
      service.getSchedulers(1, 10, null, null, 5).subscribe();

      const req = httpMock.expectOne(
        `${mockApiUrl}?idHouse=5&page=1&size=10`
      );
      
      expect(req.request.params.has('startDate')).toBe(false);
      expect(req.request.params.has('endDate')).toBe(false);
      req.flush(mockPaginationResponse);
    });
  });
});