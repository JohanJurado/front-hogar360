import { TestBed } from '@angular/core/testing';
import { SchedulerService } from './scheduler.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Scheduler } from '@app/core/models/scheduler';
import { Pagination } from '@app/core/models/pagination';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8088/api/scheduler/';
  const mockEnvironment = { apiVisitUrl: 'http://localhost:8088/api' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchedulerService,
        { provide: 'environment', useValue: mockEnvironment }
      ]
    });

    service = TestBed.inject(SchedulerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createScheduler()', () => {
    const mockScheduler: Scheduler = {
      idHouse: 1,
      startDate: new Date('2025-01-01T10:00:00Z'),
      endDate: new Date('2025-01-01T12:00:00Z')
    };

    const mockResponse: SaveDtoResponse = {
      time: '2025-01-01T00:00:00Z',
      message: 'Scheduler created successfully'
    };

    it('should send POST request with scheduler data', () => {
      service.createScheduler(mockScheduler).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockScheduler);

      req.flush(mockResponse);
    });

    it('should handle errors when creating scheduler', () => {
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

    it('should include all required scheduler fields in the request', () => {
      service.createScheduler(mockScheduler).subscribe();

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.body.idHouse).toBe(1);
      expect(req.request.body.startDate).toBe(mockScheduler.startDate);
      expect(req.request.body.endDate).toBe(mockScheduler.endDate);
      
      req.flush(mockResponse);
    });
  });

  describe('getSchedulers()', () => {
    const mockStartDate = new Date('2025-01-01T00:00:00Z');
    const mockEndDate = new Date('2025-01-02T00:00:00Z');
    const mockIdHouse = 1;
    const mockPage = PAGINATION_CONSTANTS.PAGE;
    const mockSize = PAGINATION_CONSTANTS.SIZE;

    const mockSchedulers: Scheduler[] = [
      {
        idHouse: 1,
        startDate: new Date('2025-01-01T10:00:00Z'),
        endDate: new Date('2025-01-01T12:00:00Z')
      },
      {
        idHouse: 1,
        startDate: new Date('2025-01-01T14:00:00Z'),
        endDate: new Date('2025-01-01T16:00:00Z')
      }
    ];

    const mockPaginationResponse: Pagination<Scheduler> = {
      content: mockSchedulers,
      totalElements: 2,
      totalPages: 1,
      pageSize: mockSize,
      pageNumber: mockPage,
      last: true
    };

    // it('should send GET request with correct query parameters', () => {
    //   service.getSchedulers(mockStartDate, mockEndDate, mockIdHouse, mockPage, mockSize).subscribe(response => {
    //     expect(response).toEqual(mockPaginationResponse);
    //   });

    //   const req = httpMock.expectOne(`${mockApiUrl}?startDate=${mockStartDate.toString()}&endDate=${mockEndDate.toString()}&idHouse=${mockIdHouse}&page=${mockPage}&size=${mockSize}`);
    //   expect(req.request.method).toBe('GET');
    //   expect(req.request.params.get('startDate')).toBe(mockStartDate.toString());
    //   expect(req.request.params.get('endDate')).toBe(mockEndDate.toString());
    //   expect(req.request.params.get('idHouse')).toBe(mockIdHouse.toString());
    //   expect(req.request.params.get('page')).toBe(mockPage.toString());
    //   expect(req.request.params.get('size')).toBe(mockSize.toString());

    //   req.flush(mockPaginationResponse);
    // });

    // it('should use default pagination values if not provided', () => {
    //   service.getSchedulers(mockStartDate, mockEndDate, mockIdHouse).subscribe();

    //   const req = httpMock.expectOne(`${mockApiUrl}?startDate=${mockStartDate.toString()}&endDate=${mockEndDate.toString()}&idHouse=${mockIdHouse}&page=${PAGINATION_CONSTANTS.PAGE}&size=${PAGINATION_CONSTANTS.SIZE}`);
    //   expect(req.request.params.get('page')).toBe(PAGINATION_CONSTANTS.PAGE.toString());
    //   expect(req.request.params.get('size')).toBe(PAGINATION_CONSTANTS.SIZE.toString());

    //   req.flush(mockPaginationResponse);
    // });

    // it('should handle errors when fetching schedulers', () => {
    //   service.getSchedulers(mockStartDate, mockEndDate, mockIdHouse, mockPage, mockSize).subscribe({
    //     next: () => fail('should have failed with 500 error'),
    //     error: (error) => {
    //       expect(error.status).toBe(500);
    //     }
    //   });

    //   const req = httpMock.expectOne(`${mockApiUrl}?startDate=${mockStartDate}&endDate=${mockEndDate}&idHouse=${mockIdHouse}&page=${mockPage}&size=${mockSize}`);
    //   req.flush('Server Error', { 
    //     status: 500, 
    //     statusText: 'Internal Server Error' 
    //   });
    // });

    // it('should return paginated scheduler data', () => {
    //   service.getSchedulers(mockStartDate, mockEndDate, mockIdHouse, mockPage, mockSize).subscribe(response => {
    //     expect(response.content.length).toBe(2);
    //     expect(response.totalElements).toBe(2);
    //     expect(response.content).toEqual(mockSchedulers);
    //   });

    //   const req = httpMock.expectOne(`${mockApiUrl}?startDate=${mockStartDate.toString()}&endDate=${mockEndDate.toString()}&idHouse=${mockIdHouse}&page=${mockPage}&size=${mockSize}`);
    //   req.flush(mockPaginationResponse);
    // });
  });
});