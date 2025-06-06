import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HouseFormComponent } from './house-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of, throwError } from 'rxjs';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';


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

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      component.activePublicationDateControl.setValue(pastDate.toISOString());
      expect(component.activePublicationDateControl.errors?.['invalidActivePublicationDate']).toBeTruthy();

      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);
      component.activePublicationDateControl.setValue(futureDate.toISOString());
      expect(component.activePublicationDateControl.errors?.['invalidActivePublicationDate']).toBeTruthy();

      const today = new Date();
      component.activePublicationDateControl.setValue(today.toISOString());
    
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      component.activePublicationDateControl.setValue(nextMonth.toISOString());

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
      expect(component.departmentExist()).toBe(true);
      component.setDepartmentId(1);
      expect(component.departmentExist()).toBe(false);
    });

    it('should check if city exists', () => {
      expect(component.cityExist()).toBe(true);
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

    it('should handle error on submission', fakeAsync(() => {
      const errorResponse = { error: { message: 'Error message' } };
      houseService.publishHouse.mockReturnValueOnce(throwError(() => errorResponse));
      
      fillValidForm();
      
      component.submit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalled();
      expect(translatorService.translate).toHaveBeenCalledWith('Error message');
    }));

    it('should use default error message when none provided', fakeAsync(() => {
      houseService.publishHouse.mockReturnValueOnce(throwError(() => ({})));
      
      fillValidForm();
      
      component.submit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalled();
      expect(translatorService.translate).toHaveBeenCalledWith(FORM_MESSAGES.ERROR);
    }));
  });

  describe('Form Controls', () => {
    it('should return correct form controls', () => {
      expect(component.nameControl).toBe(component.houseForm.get('name'));
      expect(component.descriptionControl).toBe(component.houseForm.get('description'));
    });

  it('should return content from getCategories response', fakeAsync(() => {
  const mockResponse = {
    content: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' }
    ]
  };
  categoryService.getCategories.mockReturnValue(of(mockResponse));

  let result: any[] = [];
  component.getCategories('test').subscribe(data => {
    result = data;
  });
  tick();

  expect(result).toEqual(mockResponse.content);
  expect(categoryService.getCategories).toHaveBeenCalledWith(
    PAGINATION_CONSTANTS.PAGE,
    PAGINATION_CONSTANTS.SIZE,
    PAGINATION_CONSTANTS.ORDER_ASC,
    'test'
  );
}));

it('should handle successful house publication with form reset', fakeAsync(() => {
  component.nameControl.setValue('Test House');
  component.descriptionControl.setValue('Test Description');
  component.bedroomCountControl.setValue('3');
  component.bathroomCountControl.setValue('2');
  component.priceControl.setValue('100000');
  
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 1);
  component.activePublicationDateControl.setValue(validDate.toISOString().split('T')[0]);
  
  component.categoryNameControl.setValue('Test Category');
  component.neighborhoodControl.setValue('Test Neighborhood');
  component.nameCityControl.setValue('Test City');
  component.nameDepartmentControl.setValue('Test Department');

  const mockResponse = { message: 'House created successfully' };
  houseService.publishHouse.mockReturnValue(of(mockResponse));

  const formResetSpy = jest.spyOn(component.houseForm, 'reset');

  component.submit();
  tick();

  expect(houseService.publishHouse).toHaveBeenCalled();
  expect(notificationService.success).toHaveBeenCalledWith('House created successfully');
  expect(translatorService.translate).toHaveBeenCalledWith('House created successfully');
  expect(formResetSpy).toHaveBeenCalled();
}));

it('should handle error with specific message', fakeAsync(() => {
  fillValidForm();

  const errorResponse = { error: { message: 'Custom error message' } };
  houseService.publishHouse.mockReturnValue(throwError(() => errorResponse));

  component.submit();
  tick();

  expect(notificationService.error).toHaveBeenCalledWith('Custom error message');
  expect(translatorService.translate).toHaveBeenCalledWith('Custom error message');
}));

it('should handle error with default message when none provided', fakeAsync(() => {
  fillValidForm();

  houseService.publishHouse.mockReturnValue(throwError(() => ({})));

  component.submit();
  tick();

  expect(notificationService.error).toHaveBeenCalledWith(FORM_MESSAGES.ERROR);
  expect(translatorService.translate).toHaveBeenCalledWith(FORM_MESSAGES.ERROR);
}));

describe('Form Control Getters', () => {
  it('should return correct form controls', () => {
    expect(component.nameControl).toBe(component.houseForm.get('name'));
    expect(component.descriptionControl).toBe(component.houseForm.get('description'));
    expect(component.bedroomCountControl).toBe(component.houseForm.get('bedroomCount'));
    expect(component.bathroomCountControl).toBe(component.houseForm.get('bathroomCount'));
    expect(component.priceControl).toBe(component.houseForm.get('price'));
    expect(component.activePublicationDateControl).toBe(component.houseForm.get('activePublicationDate'));
    expect(component.categoryNameControl).toBe(component.houseForm.get('categoryName'));
    expect(component.neighborhoodControl).toBe(component.houseForm.get('neighborhood'));
    expect(component.nameCityControl).toBe(component.houseForm.get('cityName'));
    expect(component.nameDepartmentControl).toBe(component.houseForm.get('departmentName'));
  });
});
});

function fillValidForm() {
  component.nameControl.setValue('Test House');
  component.descriptionControl.setValue('Test Description');
  component.bedroomCountControl.setValue('3');
  component.bathroomCountControl.setValue('2');
  component.priceControl.setValue('100000');
  
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 1);
  component.activePublicationDateControl.setValue(validDate.toISOString().split('T')[0]);
  
  component.categoryNameControl.setValue('Test Category');
  component.neighborhoodControl.setValue('Test Neighborhood');
  component.nameCityControl.setValue('Test City');
  component.nameDepartmentControl.setValue('Test Department');
}
});

