import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

const mockJwtHelper = {
  decodeToken: jest.fn(),
  isTokenExpired: jest.fn(),
};

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('TokenService', () => {
  let service: TokenService;
  let localStorageMock: LocalStorageMock;

  const validToken = 'eyJ.valid.token';
  const expiredToken = 'eyJ.expired.token';
  const invalidToken = 'invalid.token';

  beforeEach(() => {
    localStorageMock = new LocalStorageMock();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: JwtHelperService, useValue: mockJwtHelper },
        { provide: JWT_OPTIONS, useValue: {} },
      ],
    });

    service = TestBed.inject(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken()', () => {
    it('should return token from localStorage', () => {
      localStorageMock.setItem('authToken', validToken);
      expect(service.getToken()).toBe(validToken);
    });

    it('should return null if no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('decodeToken()', () => {
    it('should decode a valid token', () => {
      const mockDecoded = { name: 'Test User', authorities: 'ROLE_ADMIN' };
      mockJwtHelper.decodeToken.mockReturnValue(mockDecoded);
      localStorageMock.setItem('authToken', validToken);

      const decoded = service.decodeToken();
      expect(decoded).toEqual(mockDecoded);
      expect(mockJwtHelper.decodeToken).toHaveBeenCalledWith(validToken);
    });

    it('should return null if token is invalid', () => {
      mockJwtHelper.decodeToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      localStorageMock.setItem('authToken', invalidToken);

      expect(service.decodeToken()).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('isTokenExpired()', () => {
    it('should return true if token is expired', () => {
      mockJwtHelper.isTokenExpired.mockReturnValue(true);
      localStorageMock.setItem('authToken', expiredToken);

      expect(service.isTokenExpired()).toBe(true);
      expect(mockJwtHelper.isTokenExpired).toHaveBeenCalledWith(expiredToken);
    });

    it('should return true if no token exists', () => {
      expect(service.isTokenExpired()).toBe(true);
    });
  });

  describe('getRole()', () => {
    it('should extract role from token', () => {
      const mockDecoded = { authorities: 'ROLE_ADMIN' };
      mockJwtHelper.decodeToken.mockReturnValue(mockDecoded);
      localStorageMock.setItem('authToken', validToken);

      expect(service.getRole()).toBe('ADMIN');
    });

    it('should return null if no authorities exist', () => {
      const mockDecoded = { name: 'Test User' }; // Sin authorities
      mockJwtHelper.decodeToken.mockReturnValue(mockDecoded);
      localStorageMock.setItem('authToken', validToken);

      expect(service.getRole()).toBeNull();
    });
  });

  describe('Redirect URL management', () => {
    const testUrl = '/dashboard';

    it('should set and get redirect URL', () => {
      service.setRedirectUrl(testUrl);
      expect(localStorageMock.getItem('redirect_url')).toBe(testUrl);
      expect(service.getRedirectUrl()).toBe(testUrl);
    });

    it('should clear redirect URL', () => {
      service.setRedirectUrl(testUrl);
      service.clearRedirectUrl();
      expect(service.getRedirectUrl()).toBeNull();
    });
  });
});