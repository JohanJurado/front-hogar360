import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VisitService } from './visit.service';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Visit } from '@app/core/models/visit';

describe('VisitService', () => {
  let service: VisitService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8088/api/visit/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VisitService,
        { provide: 'environment', useValue: { apiVisitUrl: 'http://localhost:8088/api' } }
      ]
    });

    service = TestBed.inject(VisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createVisit', () => {
    it('should send POST request with visit data', () => {
      const mockVisit: Visit = {
        emailBuyer: 'comprador@example.com',
        idScheduler: 1
      };

      const mockResponse: SaveDtoResponse = {
        time: '',
        message: 'Visita creada exitosamente'
      };

      service.createVisit(mockVisit).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockVisit);
      
      req.flush(mockResponse);
    });

    it('should handle errors when creating visit', () => {
      const mockVisit: Visit = {
        emailBuyer: 'comprador@example.com',
        idScheduler: 1
      };

      service.createVisit(mockVisit).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush('Bad Request', { 
        status: 400, 
        statusText: 'Bad Request' 
      });
    });

    it('should handle empty response', () => {
      const mockVisit: Visit = {
        emailBuyer: 'comprador@example.com',
        idScheduler: 1
      };

      service.createVisit(mockVisit).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush(null);
    });
  });
});