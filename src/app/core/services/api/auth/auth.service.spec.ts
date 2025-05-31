import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '@app/core/models/dtos/loginRequest';
import { LoginResponse } from '@app/core/models/dtos/loginResponse';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:8085/api/auth/login';

  // Datos de prueba
  const mockLoginRequest: LoginRequest = {
    email: 'testuser@gmail.com',
    password: 'testpass'
  };

  const mockLoginResponse: LoginResponse = {
    jwt: 'eyJ.valid.token',
    message: 'token valido'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should send a POST request to login endpoint', () => {
      service.login(mockLoginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);

      req.flush(mockLoginResponse); // Simula respuesta exitosa
    });

    it('should handle HTTP errors', () => {
      const errorMessage = 'Error 500: Internal Server Error';

      service.login(mockLoginRequest).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(mockApiUrl);
      req.flush(errorMessage, { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });
  });
});