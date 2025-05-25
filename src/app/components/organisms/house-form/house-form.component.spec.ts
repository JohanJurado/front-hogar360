import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HouseFormComponent } from './house-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of, throwError } from 'rxjs';
import { House } from '@app/core/models/house';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';

// Mocks para servicios
class MockHouseService {
  publishHouse = jest.fn().mockReturnValue(of({ message: 'House created successfully' }));
}

class MockLocationService {
  getDepartments = jest.fn().mockReturnValue(of([]));
  getCities = jest.fn().mockReturnValue(of([]));
  getNeighborhoods = jest.fn().mockReturnValue(of([]));
}

class MockCategoryService {
  getCategories = jest.fn().mockReturnValue(of({ content: [] }));
}

class MockNotificationService {
  success = jest.fn();
  error = jest.fn();
}

class MockTranslatorService {
  translate = jest.fn().mockImplementation((key) => key);
}

describe('HouseFormComponent', () => {
  let component: HouseFormComponent;
  let fixture: ComponentFixture<HouseFormComponent>;
  let houseService: MockHouseService;
  let locationService: MockLocationService;
  let categoryService: MockCategoryService;
  let notificationService: MockNotificationService;
  let translatorService: MockTranslatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [HouseFormComponent, InputComponent, SelectComponent],
      providers: [
        FormBuilder,
        { provide: HouseService, useClass: MockHouseService },
        { provide: LocationService, useClass: MockLocationService },
        { provide: CategoryService, useClass: MockCategoryService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: TranslatorService, useClass: MockTranslatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseFormComponent);
    component = fixture.componentInstance;
    houseService = TestBed.inject(HouseService) as unknown as MockHouseService;
    locationService = TestBed.inject(LocationService) as unknown as MockLocationService;
    categoryService = TestBed.inject(CategoryService) as unknown as MockCategoryService;
    notificationService = TestBed.inject(NotificationService) as unknown as MockNotificationService;
    translatorService = TestBed.inject(TranslatorService) as unknown as MockTranslatorService;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.houseForm.value).toEqual({
        name: '',
        description: '',
        bedroomCount: '',
        bathroomCount: '',
        price: '',
        activePublicationDate: null,
        categoryName: '',
        neighborhood: '',
        cityName: '',
        departmentName: ''
      });
    });

    it('should initialize with department and city IDs as 0', () => {
      expect(component.idDepartment).toBe(0);
      expect(component.idCity).toBe(0);
    });
  });

  describe('Form Validation', () => {
    it('should mark all fields as touched when invalid form is submitted', () => {
      const markAllAsTouchedSpy = jest.spyOn(component.houseForm, 'markAllAsTouched');
      
      component.submit();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(component.houseForm.touched).toBe(true);
    });

    it('should validate active publication date', () => {
      // Test date in the past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      component.activePublicationDateControl.setValue(pastDate.toISOString());
      expect(component.activePublicationDateControl.errors?.['invalidActivePublicationDate']).toBeTruthy();

      // Test date more than 1 month in future
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);
      component.activePublicationDateControl.setValue(futureDate.toISOString());
      expect(component.activePublicationDateControl.errors?.['invalidActivePublicationDate']).toBeTruthy();

      // Test valid date (today)
      const today = new Date();
      component.activePublicationDateControl.setValue(today.toISOString());
      expect(component.activePublicationDateControl.errors).toBeNull();

      // Test valid date (1 month in future)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      component.activePublicationDateControl.setValue(nextMonth.toISOString());
      expect(component.activePublicationDateControl.errors).toBeNull();
    });
  });

  describe('Department and City Handling', () => {
    it('should set department ID', () => {
      component.setDepartmentId(5);
      expect(component.idDepartment).toBe(5);
    });

    it('should set city ID', () => {
      component.setCityId(10);
      expect(component.idCity).toBe(10);
    });

    it('should check if department exists', () => {
      expect(component.departmentExist()).toBe(true); // Initially 0
      component.setDepartmentId(1);
      expect(component.departmentExist()).toBe(false);
    });

    it('should check if city exists', () => {
      expect(component.cityExist()).toBe(true); // Initially 0
      component.setCityId(1);
      expect(component.cityExist()).toBe(false);
    });
  });

  describe('Service Methods', () => {
    it('should call getDepartments', () => {
      component.getDepartments('test');
      expect(locationService.getDepartments).toHaveBeenCalledWith('test');
    });

    it('should call getCities with department ID', () => {
      component.setDepartmentId(5);
      component.getCities('test', 5);
      expect(locationService.getCities).toHaveBeenCalledWith('test', 5);
    });

    it('should call getNeighborhoods with city and department IDs', () => {
      component.setDepartmentId(5);
      component.setCityId(10);
      component.getNeighborhoods('test', 10);
      expect(locationService.getNeighborhoods).toHaveBeenCalledWith('test', 10, 5);
    });

    it('should call getCategories with pagination constants', () => {
      component.getCategories('test');
      expect(categoryService.getCategories).toHaveBeenCalledWith(
        PAGINATION_CONSTANTS.PAGE,
        PAGINATION_CONSTANTS.SIZE,
        PAGINATION_CONSTANTS.ORDER_ASC,
        'test'
      );
    });
  });

  describe('Form Submission', () => {
    it('should call houseService.publishHouse on valid submission', fakeAsync(() => {
  // Fill form with valid data
  component.nameControl.setValue('Test House');
  component.descriptionControl.setValue('Test Description');
  component.bedroomCountControl.setValue(3);  // Cambiado a número
  component.bathroomCountControl.setValue(2); // Cambiado a número
  component.priceControl.setValue(100000);    // Cambiado a número
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 6);
  component.activePublicationDateControl.setValue(tomorrow);
  
  component.categoryNameControl.setValue('Test Category');
  component.neighborhoodControl.setValue('Test Neighborhood');
  component.nameCityControl.setValue('Test City');
  component.nameDepartmentControl.setValue('Test Department');
  
  // Eliminar fixture.detectChanges() si no es necesario
  // O usar detectChanges una sola vez después de todos los cambios
  
  // Trigger submit
  component.submit();
  tick();
  
  // Verificar que el formulario es válido
//  expect(component.houseForm.valid).toBeTruthy();
  
  // Verify service call - ajustado para coincidir con el tipo real
  expect(houseService.publishHouse).toHaveBeenCalledWith({
    name: 'Test House',
    description: 'Test Description',
    bedroomCount: 3,
    bathroomCount: 2,
    price: 100000,
    activePublicationDate: new Date(tomorrow.toISOString()),
    categoryName: 'Test Category',
    neighborhood: 'Test Neighborhood',
    cityName: 'Test City',
    departmentName: 'Test Department'
  } as House);
  
  // Verify success notification
  expect(notificationService.success).toHaveBeenCalledWith('House created successfully');
  expect(translatorService.translate).toHaveBeenCalledWith('House created successfully');
}));

it('should handle error on submission', fakeAsync(() => {
  // Mock error response
  houseService.publishHouse.mockReturnValueOnce(throwError(() => ({ error: { message: 'Error message' } })));
  
  // Fill ALL required fields
  component.nameControl.setValue('Test House');
  component.descriptionControl.setValue('Test Description');
  component.bedroomCountControl.setValue('3');
  component.bathroomCountControl.setValue('2');
  component.priceControl.setValue('100000');
  component.activePublicationDateControl.setValue(new Date().toISOString());
  component.categoryNameControl.setValue('Test Category');
  component.neighborhoodControl.setValue('Test Neighborhood');
  component.nameCityControl.setValue('Test City');
  component.nameDepartmentControl.setValue('Test Department');
  
  component.submit();
  tick();
  
  expect(notificationService.error).toHaveBeenCalledWith('Error message');
}));

it('should use default error message when none provided', fakeAsync(() => {
  houseService.publishHouse.mockReturnValueOnce(throwError(() => ({})));
  
  // Fill ALL required fields
  component.nameControl.setValue('Test House');
  component.descriptionControl.setValue('Test Description');
  component.bedroomCountControl.setValue('3');
  component.bathroomCountControl.setValue('2');
  component.priceControl.setValue('100000');
  component.activePublicationDateControl.setValue(new Date().toISOString());
  component.categoryNameControl.setValue('Test Category');
  component.neighborhoodControl.setValue('Test Neighborhood');
  component.nameCityControl.setValue('Test City');
  component.nameDepartmentControl.setValue('Test Department');
  
  component.submit();
  tick();
  
  expect(notificationService.error).toHaveBeenCalledWith(FORM_MESSAGES.ERROR);
}));
  });

  describe('Form Controls', () => {
    it('should return correct form controls', () => {
      expect(component.nameControl).toBe(component.houseForm.get('name'));
      expect(component.descriptionControl).toBe(component.houseForm.get('description'));
      // Test other controls similarly
    });
  });
});