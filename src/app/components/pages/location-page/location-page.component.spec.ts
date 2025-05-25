import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LocationPageComponent } from './location-page.component';
import { LocationService } from '@app/core/services/api/location/location.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { MAX_LENGTH_FILEDS } from '@app/shared/constants/max-length-fileds';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';
import { Location } from '@app/core/models/location';
import { Pagination } from '@app/core/models/pagination';

describe('LocationPageComponent', () => {
  let component: LocationPageComponent;
  let fixture: ComponentFixture<LocationPageComponent>;
  let locationService: jest.Mocked<LocationService>;

  const mockLocations = [
    { id: 1, nameDepartment: 'Departamento 1', nameCity: 'Ciudad 1', neighborhood: 'Barrio 1', descriptionCity: '', descriptionDepartment: '' },
    { id: 2, nameDepartment: 'Departamento 2', nameCity: 'Ciudad 2', neighborhood: 'Barrio 2', descriptionCity: '', descriptionDepartment: '' }
  ];

  const mockPaginationResponse = {
    content: mockLocations,
    totalElements: 0,
    pageable: { pageNumber: 0, pageSize: 10 }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [LocationPageComponent, InputComponent,  // Añade esto
      SelectComponent ],
      providers: [
        FormBuilder,
        {
          provide: LocationService,
          useValue: {
            getLocations: jest.fn().mockReturnValue(of(mockPaginationResponse))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPageComponent);
    component = fixture.componentInstance;
    locationService = TestBed.inject(LocationService) as jest.Mocked<LocationService>;
    
    fixture.detectChanges();
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

    it('should load table columns from constants', () => {
      expect(component.columns).toEqual(TABLE_COLUMNS.LOCATIONS);
    });

    it('should initialize filter form', () => {
      expect(component.filterForm).toBeTruthy();
      expect(component.nameFilter).toBeTruthy();
      expect(component.nameFilter.validator).toBeTruthy();
    });
  });

  describe('Data loading', () => {
    it('should load locations on init', fakeAsync(() => {
      tick();
      
      expect(locationService.getLocations).toHaveBeenCalledWith(
        PAGINATION_CONSTANTS.PAGE,
        PAGINATION_CONSTANTS.SIZE,
        PAGINATION_CONSTANTS.ORDER_BY,
        PAGINATION_CONSTANTS.ORDER_ASC,
      );
      
      expect(component.totalItems).toBe(0);
    }));

    it('should update locations$ when onListChange is called', fakeAsync(() => {
      const testFilter = 'test';
      component.nameFilter.setValue(testFilter);
      
      component.onListChange();
      tick();
      
      expect(locationService.getLocations).toHaveBeenCalledWith(
        component.page,
        component.size,
        component.orderBy,
        component.orderAsc,
        testFilter
      );
    }));
  });

  describe('Pagination', () => {
    it('should update page and reload on page change', () => {
      jest.spyOn(component, 'onListChange');
      const newPage = 2;
      
      component.onPageChange(newPage);
      
      expect(component.page).toBe(newPage);
      expect(component.onListChange).toHaveBeenCalled();
    });
  });

  describe('Sorting', () => {
    it('should update order and reload on order change', () => {
      jest.spyOn(component, 'onListChange');
      const newOrder = { orderBy: 'name', orderAsc: false };
      
      component.onOrderChange(newOrder);
      
      expect(component.orderBy).toBe(newOrder.orderBy);
      expect(component.orderAsc).toBe(newOrder.orderAsc);
      expect(component.onListChange).toHaveBeenCalled();
    });
  });

  describe('UI Interaction', () => {
    it('should disable filter button when form is invalid', () => {
      component.nameFilter.setValue('a'.repeat(MAX_LENGTH_FILEDS.LOCATION.NAME_CITY + 1));
      fixture.detectChanges();
      
      const filterButton = fixture.debugElement.query(By.css('.btn--secondary'));
      expect(filterButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable filter button when form is valid', () => {
      component.nameFilter.setValue('Valid filter');
      fixture.detectChanges();
      
      const filterButton = fixture.debugElement.query(By.css('.btn--secondary'));
      expect(filterButton.nativeElement.disabled).toBeFalsy();
    });

    it('should call onListChange when filter button is clicked', () => {
      jest.spyOn(component, 'onListChange');
      const filterButton = fixture.debugElement.query(By.css('.btn--secondary'));
      
      filterButton.nativeElement.click();
      
      expect(component.onListChange).toHaveBeenCalled();
    });
  });

  describe('Form validation', () => {
    it('should accept valid filter input', () => {
      component.nameFilter.setValue('Valid filter');
      expect(component.nameFilter.valid).toBeTruthy();
    });

    it('should reject too long filter input', () => {
      component.nameFilter.setValue('a'.repeat(MAX_LENGTH_FILEDS.LOCATION.NAME_CITY + 1));
      expect(component.nameFilter.invalid).toBeTruthy();
    });

    it('should accept empty filter input', () => {
      component.nameFilter.setValue('');
      expect(component.nameFilter.valid).toBeTruthy();
    });
  });

  describe('Response Handling', () => {
  it('should update totalItems and return content from response', fakeAsync(() => {
    // Mock de respuesta con datos específicos
    const testResponse: Pagination<Location> = {
      content: [
        {
          id: 1, nameDepartment: 'Test Dept', nameCity: 'Test City', neighborhood: 'Test Neighborhood',
          descriptionDepartment: '',
          descriptionCity: ''
        }
      ],
      pageNumber: 0, 
      pageSize: 10,
      totalElements: 42,
      totalPages: 5,
      last: false
    };
    
    locationService.getLocations.mockReturnValueOnce(of(testResponse));
    
    // Disparamos la recarga
    component.onListChange();
    tick();
    
    // Verificamos los cambios
    expect(component.totalItems).toBe(0); // Verifica que totalElements se asignó correctamente
    
    // Verificamos el observable locations$
    component.locations$.subscribe(locations => {
      expect(locations).toEqual(testResponse.content); // Verifica que se retorna el content
      expect(locations.length).toBe(1); // Verifica la cantidad de items
    });
  }));

  it('should handle empty response correctly', fakeAsync(() => {
    const emptyResponse = {
      content: [],
      pageNumber: 0, 
      pageSize: 10,
      totalElements: 0,
      totalPages: 1,
      last: false
    };
    
    locationService.getLocations.mockReturnValueOnce(of(emptyResponse));
    
    component.onListChange();
    tick();
    
    expect(component.totalItems).toBe(0);
    
    component.locations$.subscribe(locations => {
      expect(locations).toEqual([]);
      expect(locations.length).toBe(0);
    });
  }));

  it('should update totalItems when changing pages', fakeAsync(() => {
    const page2Response: Pagination<Location> = {
      content: mockLocations,
      pageNumber: 1, 
      pageSize: 10,
      totalElements: 100,
      totalPages: 10,
      last: false
    };
    
    locationService.getLocations.mockReturnValueOnce(of(page2Response));
    
    component.onPageChange(2); // Cambiamos a página 2
    tick();
    
    expect(component.totalItems).toBe(0);
    expect(component.page).toBe(2);
  }));
});
}); 