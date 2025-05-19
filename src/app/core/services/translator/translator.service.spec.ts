import { TestBed } from '@angular/core/testing';
import { TranslatorService } from './translator.service';

describe('TranslatorService', () => {
  let service: TranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslatorService]
    });
    service = TestBed.inject(TranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('translate()', () => {
    it('should return translated string when key exists', () => {
      expect(service.translate('Category already exists')).toBe('La categoría ya existe');
      expect(service.translate('Location saved successfully.')).toBe('Ubicacion guardada exitosamente.');
    });

    it('should return same key when translation does not exist', () => {
      const nonExistentKey = 'Nonexistent message';
      expect(service.translate(nonExistentKey)).toBe(nonExistentKey);
    });

    it('should handle empty string', () => {
      expect(service.translate('')).toBe('');
    });

    it('should handle null or undefined', () => {
      // @ts-ignore - Forzamos prueba de caso edge
      expect(service.translate(null)).toBeNull();
      // @ts-ignore - Forzamos prueba de caso edge
      expect(service.translate(undefined)).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const lowerCaseKey = 'category already exists';
      expect(service.translate(lowerCaseKey)).toBe(lowerCaseKey);
    });
  });

  describe('translation dictionary', () => {
    it('should have all defined translations', () => {
      const testCases = [
        { key: 'Category already exists', expected: 'La categoría ya existe' },
        { key: 'Location already exists', expected: 'La ubicación ya existe' },
        { key: 'Category saved successfully.', expected: 'Categoría guardada exitosamente.' },
        { key: 'Location saved successfully.', expected: 'Ubicacion guardada exitosamente.' }
      ];

      testCases.forEach(test => {
        expect(service.translate(test.key)).toBe(test.expected);
      });
    });
  });
});