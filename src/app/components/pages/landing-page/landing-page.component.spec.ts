import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';

// Mocks para servicios
class MockHouseService {
  getHouses = jest.fn().mockReturnValue(of({
    content: [],
    totalElements: 0,
    pageable: { pageNumber: 0, pageSize: 10 }
  }));
}

class MockLocationService {
  getDepartments = jest.fn().mockReturnValue(of([]));
  getCities = jest.fn().mockReturnValue(of([]));
  getNeighborhoods = jest.fn().mockReturnValue(of([]));
}

class MockCategoryService {
  getCategories = jest.fn().mockReturnValue(of({ content: [] }));
}

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let houseService: MockHouseService;
  let locationService: MockLocationService;
  let categoryService: MockCategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [LandingPageComponent, InputComponent, SelectComponent],
      providers: [
        FormBuilder,
        { provide: HouseService, useClass: MockHouseService },
        { provide: LocationService, useClass: MockLocationService },
        { provide: CategoryService, useClass: MockCategoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    houseService = TestBed.inject(HouseService) as unknown as MockHouseService;
    locationService = TestBed.inject(LocationService) as unknown as MockLocationService;
    categoryService = TestBed.inject(CategoryService) as unknown as MockCategoryService;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values from constants', () => {
      expect(component.page).toBe(PAGINATION_CONSTANTS.PAGE);
      expect(component.size).toBe(PAGINATION_CONSTANTS.SIZE);
      expect(component.orderBy).toBe(PAGINATION_CONSTANTS.ORDER_BY);
      expect(component.orderAsc).toBe(PAGINATION_CONSTANTS.ORDER_ASC);
      expect(component.totalItems).toBe(PAGINATION_CONSTANTS.TOTAL_ITEMS);
    });

    it('should initialize filter form', () => {
      expect(component.filterForm).toBeTruthy();
      expect(component.filterForm.value.orderBy).toBe('city');
      expect(component.filterForm.value.orderAsc).toBe('true');
    });
  });

  describe('Modal Toggle', () => {
    it('should toggle modalFilterOptions', () => {
      expect(component.modalFilterOptions).toBe(false);
      component.changeViewFilterOptions();
      expect(component.modalFilterOptions).toBe(true);
      component.changeViewFilterOptions();
      expect(component.modalFilterOptions).toBe(false);
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

  describe('Pagination', () => {
    it('should calculate totalPages correctly', () => {
      component.totalItems = 25;
      component.size = 10;
      expect(component.totalPages).toBe(3);
    });

    it('should calculate startItem and endItem correctly', () => {
      component.totalItems = 25;
      component.size = 10;
      component.page = 1;
      expect(component.startItem).toBe(10);
      expect(component.endItem).toBe(20);
    });

    it('should get correct page range', () => {
      component.totalItems = 50;
      component.size = 10;
      component.page = 2;
      const range = component.getPageRange();
      expect(range.length).toBe(4);
      expect(range).toEqual([0, 1, 2, 3]);
    });

    it('should change page', () => {
      const spy = jest.spyOn(component, 'changeList');
      component.onPageChange(2);
      expect(component.page).toBe(2);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Filter Methods', () => {
    it('should apply new filter values', () => {
      const spy = jest.spyOn(component, 'changeList');
      
      component.filterForm.patchValue({
        orderBy: 'price',
        orderAsc: ''
      });
      
      component.newFilterValues();
      
      expect(component.orderBy).toBe('price');
      expect(component.orderAsc).toBe(false);
      expect(spy).toHaveBeenCalled();
      expect(component.modalFilterOptions).toBe(false);
    });

    it('should use default values when filter values are null', () => {
      component.filterForm.patchValue({
        orderBy: null,
        orderAsc: null
      });
      
      component.newFilterValues();
      
      expect(component.orderBy).toBe(PAGINATION_CONSTANTS.ORDER_BY);
      expect(component.orderAsc).toBe(PAGINATION_CONSTANTS.ORDER_ASC);
    });

    it('should reset filter form', () => {
      component.filterForm.patchValue({
        neighborhood: 'Test',
        nameCity: 'Test City'
      });
      
      component.resetFilterForm();
      
      expect(component.filterForm.value.neighborhood).toBeNull();
      expect(component.filterForm.value.nameCity).toBeNull();
    });

    it('should change list with current filters', fakeAsync(() => {
      const mockResponse = {
        content: [{ name: 'Test House' }],
        totalElements: 1
      };
      
      houseService.getHouses.mockReturnValueOnce(of(mockResponse));
      
      component.changeList();
      tick();
      
      expect(houseService.getHouses).toHaveBeenCalled();
      
      component.houses$.subscribe(houses => {
        expect(houses).toEqual(mockResponse.content);
        expect(component.totalItems).toBe(1);
      });
    }));
  });

  describe('House Image', () => {
    it('should return correct house image path', () => {
      expect(component.getHouseImage(0)).toContain('house-card-img-1.png');
      expect(component.getHouseImage(1)).toContain('house-card-img-2.png');
      expect(component.getHouseImage(2)).toContain('house-card-img-3.png');
      expect(component.getHouseImage(3)).toContain('house-card-img-1.png'); // Cycles back
    });
  });

describe('FormControl Getters', () => {
  
  // Definimos una interfaz para los controles
  interface ComponentControls {
    neighborhoodControl: FormControl;
    nameCityControl: FormControl;
    nameDepartmentControl: FormControl;
    nameCategoryControl: FormControl;
    bedroomCountControl: FormControl;
    bathroomCountControl: FormControl;
    minPriceControl: FormControl;
    maxPriceControl: FormControl;
    orderByControl: FormControl;
    orderAscControl: FormControl;
  }

  // Lista de controles con tipado fuerte
  const testControls: Array<{
    name: keyof ComponentControls;
    controlName: string;
  }> = [
    { name: 'neighborhoodControl', controlName: 'neighborhood' },
    { name: 'nameCityControl', controlName: 'nameCity' },
    { name: 'nameDepartmentControl', controlName: 'nameDepartment' },
    { name: 'nameCategoryControl', controlName: 'nameCategory' },
    { name: 'bedroomCountControl', controlName: 'bedroomCount' },
    { name: 'bathroomCountControl', controlName: 'bathroomCount' },
    { name: 'minPriceControl', controlName: 'minPrice' },
    { name: 'maxPriceControl', controlName: 'maxPrice' },
    { name: 'orderByControl', controlName: 'orderBy' },
    { name: 'orderAscControl', controlName: 'orderAsc' }
  ];

  testControls.forEach(({name, controlName}) => {
    it(`should return ${controlName} FormControl for ${name}`, () => {
      // Usamos un type assertion para el acceso dinámico
      const control = (component as unknown as ComponentControls)[name];
      expect(control).toBeInstanceOf(FormControl);
      expect(component.filterForm.get(controlName)).toBe(control);
    });
  });
});

  it('should allow setting and getting values through controls', () => {
    // Probamos con algunos controles representativos
    component.neighborhoodControl.setValue('El Poblado');
    expect(component.filterForm.value.neighborhood).toBe('El Poblado');
    
    component.bedroomCountControl.setValue(3);
    expect(component.filterForm.value.bedroomCount).toBe(3);
    
    component.orderByControl.setValue('price');
    expect(component.filterForm.value.orderBy).toBe('price');
    });
    describe('getCategories()', () => {

  const mockCategories = [
    { id: 1, name: 'Casa' },
    { id: 2, name: 'Apartamento' }
  ];


  it('should return categories content from response', fakeAsync(() => {
    categoryService.getCategories.mockReturnValueOnce(of({
      content: mockCategories,
      totalElements: 2
    }));

    let result: any;
    component.getCategories('test').subscribe(res => result = res);
    tick();

    expect(result).toEqual(mockCategories);
    expect(categoryService.getCategories).toHaveBeenCalledWith(
      PAGINATION_CONSTANTS.PAGE,
      PAGINATION_CONSTANTS.SIZE,
      PAGINATION_CONSTANTS.ORDER_ASC,
      'test'
    );
  }));

  it('should handle empty response', fakeAsync(() => {
    categoryService.getCategories.mockReturnValueOnce(of({
      content: [],
      totalElements: 0
    }));

    let result: any;
    component.getCategories('').subscribe(res => result = res);
    tick();

    expect(result).toEqual([]);
  }));
  });
});