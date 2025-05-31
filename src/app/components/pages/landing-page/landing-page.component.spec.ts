import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LandingPageComponent } from './landing-page.component';
import { HouseService } from '@app/core/services/api/house/house.service';
import { LocationService } from '@app/core/services/api/location/location.service';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { of } from 'rxjs';
import { HomeFilterFields } from '@app/core/models/dtos/homeFilterFields';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HouseFiltersComponent } from '@app/components/organisms/house-filters/house-filters.component';
import { CardComponent } from '@app/components/molecules/card/card.component';
import { PaginationComponent } from '@app/components/molecules/pagination/pagination.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let houseServiceMock: jest.Mocked<HouseService>;
  let locationServiceMock: jest.Mocked<LocationService>;
  let categoryServiceMock: jest.Mocked<CategoryService>;

  beforeEach(async () => {
    // Configurar mocks para los servicios
    houseServiceMock = {
      getHouses: jest.fn().mockReturnValue(of({
        content: [],
        totalElements: 0
      }))
    } as any;

    locationServiceMock = {
      getDepartments: jest.fn().mockReturnValue(of([])),
      getCities: jest.fn().mockReturnValue(of([])),
      getNeighborhoods: jest.fn().mockReturnValue(of([]))
    } as any;

    categoryServiceMock = {
      getCategories: jest.fn().mockReturnValue(of({ content: [] }))
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        LandingPageComponent,
        HouseFiltersComponent,
        CardComponent,
        PaginationComponent,
        SelectComponent,
        InputComponent 
      ],
      providers: [
        FormBuilder,
        { provide: HouseService, useValue: houseServiceMock },
        { provide: LocationService, useValue: locationServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora componentes que no importamos
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.page).toBe(0);
      expect(component.size).toBe(10);
      expect(component.totalItems).toBe(0);
      expect(component.modalFilterOptions).toBe(false);
      expect(component.idDepartment).toBe(0);
      expect(component.idCity).toBe(0);
    });

    it('should initialize form with default values', () => {
      expect(component.filterForm.value).toEqual({
        nameDepartment: '',
        nameCity: '',
        neighborhood: '',
        nameCategory: '',
        bedroomCount: '',
        bathroomCount: '',
        minPrice: '',
        maxPrice: '',
        orderBy: 'city',
        orderAsc: 'true'
      });
    });
  });

  describe('Filter Methods', () => {
    it('should toggle filter modal', () => {
      expect(component.modalFilterOptions).toBe(false);
      component.toggleFilterModal();
      expect(component.modalFilterOptions).toBe(true);
      component.toggleFilterModal();
      expect(component.modalFilterOptions).toBe(false);
    });

    it('should apply filters and reset page', fakeAsync(() => {
      const loadHousesSpy = jest.spyOn(component as any, 'loadHouses');
      component.page = 5;
      
      component.applyFilters();
      tick();
      
      expect(component.page).toBe(0);
      expect(component.modalFilterOptions).toBe(false);
      expect(loadHousesSpy).toHaveBeenCalled();
    }));

    it('should reset filters and apply them', fakeAsync(() => {
      // Setear valores iniciales
      component.filterForm.patchValue({
        nameDepartment: 'Test',
        nameCity: 'Test',
        orderBy: 'price'
      });
      component.idDepartment = 1;
      component.idCity = 1;
      
      component.resetFilters();
      tick();
      
      expect(component.filterForm.value).toEqual({
        nameDepartment: null,
        nameCity: null,
        neighborhood: null,
        nameCategory: null,
        bedroomCount: null,
        bathroomCount: null,
        minPrice: null,
        maxPrice: null,
        orderBy: 'city',
        orderAsc: 'true'
      });
      expect(component.idDepartment).toBe(0);
      expect(component.idCity).toBe(0);
    }));
  });

  describe('Location Methods', () => {
    it('should set department ID and reset city fields', () => {
      component.filterForm.patchValue({
        nameCity: 'Test',
        neighborhood: 'Test'
      });
      component.idCity = 5;
      
      component.setDepartmentId(10);
      
      expect(component.idDepartment).toBe(10);
      expect(component.idCity).toBe(0);
      expect(component.filterForm.get('nameCity')?.value).toBe(null);
      expect(component.filterForm.get('neighborhood')?.value).toBe(null);
    });

    it('should set city ID and reset neighborhood field', () => {
      component.filterForm.patchValue({
        neighborhood: 'Test'
      });
      
      component.setCityId(15);
      
      expect(component.idCity).toBe(15);
      expect(component.filterForm.get('neighborhood')?.value).toBe(null);
    });
  });

  describe('Pagination', () => {
    it('should change page and load houses', fakeAsync(() => {
      const loadHousesSpy = jest.spyOn(component as any, 'loadHouses');
      
      component.onPageChange(3);
      tick();
      
      expect(component.page).toBe(3);
      expect(loadHousesSpy).toHaveBeenCalled();
    }));
  });

  describe('Service Methods', () => {
    it('should call getDepartments from location service', () => {
      const testName = 'Test';
      component.getDepartments(testName);
      
      expect(locationServiceMock.getDepartments).toHaveBeenCalledWith(testName);
    });

    it('should call getCities with department ID', () => {
      const testName = 'Test';
      const testId = 5;
      component.getCities(testName, testId);
      
      expect(locationServiceMock.getCities).toHaveBeenCalledWith(testName, testId);
    });

    it('should call getCategories with name filter', () => {
      const testName = 'Test';
      component.getCategories(testName);
      
      expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(
        0, // PAGE
        10, // SIZE
        true, // ORDER_ASC
        testName
      );
    });
  });

  describe('Template Rendering', () => {
    // it('should show loading state initially', () => {
    //   const loadingEl = fixture.debugElement.query(By.css('.loading-spinner'));
    //   expect(loadingEl).toBeTruthy();
    // });

    it('should show no results when empty array returned', fakeAsync(() => {
      houseServiceMock.getHouses.mockReturnValueOnce(of({
        content: [], // 3 items mock
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 1,
        last: true
      }));
      
      component.loadHouses();
      fixture.detectChanges();
      tick();
      
      const noResultsEl = fixture.debugElement.query(By.css('.no-results'));
      expect(noResultsEl).toBeTruthy();
      expect(noResultsEl.nativeElement.textContent).toContain('No se encontraron resultados');
    }));

    it('should show pagination when totalItems > 0', fakeAsync(() => {
      houseServiceMock.getHouses.mockReturnValueOnce(of({
        content: [{
          name: 'string',
          description: 'string',
          bedroomCount: 1,
          bathroomCount: 1,
          price: 10,
          activePublicationDate: new Date(),
          neighborhood: 'string',
          cityName: 'string',
          departmentName: 'string',
          categoryName: 'string'
        }], // 3 items mock
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
        last: true
      }));

      component.loadHouses();
      fixture.detectChanges();
      tick();
      
      const paginationEl = fixture.debugElement.query(By.css('app-pagination'));
      expect(paginationEl).toBeTruthy();
    }));
  });

  describe('loadHouses', () => {
    it('should call houseService with correct parameters', fakeAsync(() => {
      component.filterForm.patchValue({
        orderBy: 'price',
        orderAsc: 'false'
      });
      component.page = 2;
      component.size = 20;
      
      component.loadHouses();
      tick();
      
      expect(houseServiceMock.getHouses).toHaveBeenCalledWith(
        component.filterForm.value as HomeFilterFields,
        2, // page
        20, // size
        'price', // orderBy
        false // orderAsc
      );
    }));

    it('should update totalItems and houses$', fakeAsync(() => {
      const mockResponse = {
        content: [{
          name: 'string',
          description: 'string',
          bedroomCount: 1,
          bathroomCount: 1,
          price: 10,
          activePublicationDate: new Date(),
          neighborhood: 'string',
          cityName: 'string',
          departmentName: 'string',
          categoryName: 'string'
        }], // 3 items mock
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
        last: true
      };
      houseServiceMock.getHouses.mockReturnValueOnce(of(mockResponse));
      
      component.loadHouses();
      tick();
      
      expect(component.totalItems).toBe(0);
      component.houses$.subscribe(houses => {
        expect(houses).toEqual(mockResponse.content);
      });
    }));
  });

  describe('Service Methods', () => {
    it('should call getDepartments from location service', () => {
      const testName = 'Test';
      component.getDepartments(testName);
      expect(locationServiceMock.getDepartments).toHaveBeenCalledWith(testName);
    });

    it('should call getCities with department ID', () => {
      const testName = 'Test';
      const testId = 5;
      component.getCities(testName, testId);
      expect(locationServiceMock.getCities).toHaveBeenCalledWith(testName, testId);
    });

    it('should call getCategories and map to content', fakeAsync(() => {


      const mockResponse = {
        content: [{
          name: 'string',
          description: 'string',
          bedroomCount: 1,
          bathroomCount: 1,
          price: 10,
          activePublicationDate: new Date(),
          neighborhood: 'string',
          cityName: 'string',
          departmentName: 'string',
          categoryName: 'string'
        }], // 3 items mock
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
        last: true
      };
      
      categoryServiceMock.getCategories.mockReturnValue(of(mockResponse));
      
      const testName = 'test';
      let result: any;
      
      component.getCategories(testName).subscribe(res => {
        result = res;
      });
      
      tick();
      
      expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(
        PAGINATION_CONSTANTS.PAGE,
        PAGINATION_CONSTANTS.SIZE,
        PAGINATION_CONSTANTS.ORDER_ASC,
        testName
      );
      
      expect(result).toEqual(mockResponse.content);
    }));

    it('should call getNeighborhoods with city and department IDs', () => {
      component.idDepartment = 5;
      const testName = 'Test';
      const testId = 10;
      component.getNeighborhoods(testName, testId);
      expect(locationServiceMock.getNeighborhoods).toHaveBeenCalledWith(testName, testId, 5);
    });
  });

});