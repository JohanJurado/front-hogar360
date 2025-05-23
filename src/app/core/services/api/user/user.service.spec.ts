import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { User } from '@app/core/models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8085/api/user/';
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: 'environment', useValue: { apiUserUrl: 'http://localhost:8085/api' } },
        { provide: 'token', useValue: mockToken }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createSeller()', () => {
    const mockUser: User = {
      name: 'John',
      lastName: 'Doe',
      document: Number('123456789'),
      phoneNumber: '+573001234567',
      birthdate: new Date('1990-01-01'),
      email: 'john@example.com',
      password: 'password123',
    };

    it('should send POST request with authorization header', () => {
      const mockResponse: SaveDtoResponse = {
        time: '2023-01-01',
        message: 'User created successfully'
      };

      service.createSeller(mockUser).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);

      req.flush(mockResponse);
    });

    it('should handle errors when creating user', () => {
      service.createSeller(mockUser).subscribe({
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

    it('should include all required user fields in the request', () => {
      service.createSeller(mockUser).subscribe();

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.body.name).toBe('John');
      expect(req.request.body.lastName).toBe('Doe');
      expect(req.request.body.document).toBe(123456789);
      expect(req.request.body.email).toBe('john@example.com');
      
      req.flush({} as SaveDtoResponse);
    });
  });
});