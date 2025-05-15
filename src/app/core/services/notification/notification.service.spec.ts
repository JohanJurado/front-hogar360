import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastrService: jest.Mocked<ToastrService>;

  beforeEach(() => {
    // Mock de ToastrService
    const toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastrService, useValue: toastrMock }
      ]
    });

    service = TestBed.inject(NotificationService);
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    it('should call toastr.success with correct message', () => {
      const testMessage = 'Éxito en la operación';
      service.success(testMessage);
      expect(toastrService.success).toHaveBeenCalledWith(testMessage);
    });
  });

  describe('error()', () => {
    it('should call toastr.error with correct message and title', () => {
      const testMessage = 'Error crítico';
      service.error(testMessage);
      expect(toastrService.error).toHaveBeenCalledWith(testMessage, 'Error');
    });
  });

  describe('warning()', () => {
    it('should call toastr.warning with correct message', () => {
      const testMessage = 'Advertencia importante';
      service.warning(testMessage);
      expect(toastrService.warning).toHaveBeenCalledWith(testMessage);
    });
  });

  // Prueba adicional para mensajes vacíos
  it('should handle empty messages', () => {
    service.success('');
    expect(toastrService.success).toHaveBeenCalledWith('');
  });
});