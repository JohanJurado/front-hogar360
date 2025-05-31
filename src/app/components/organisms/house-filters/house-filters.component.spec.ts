import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HouseFiltersComponent } from './house-filters.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SelectComponent } from '@app/components/molecules/select/select.component';
import { InputComponent } from '@app/components/atoms/input/input.component';

describe('HouseFiltersComponent', () => {
  let component: HouseFiltersComponent;
  let fixture: ComponentFixture<HouseFiltersComponent>;
  let mockForm: FormGroup;

  // Mocks para las funciones de servicio
  const mockGetDepartments = jest.fn().mockReturnValue(of([]));
  const mockGetCities = jest.fn().mockReturnValue(of([]));
  const mockGetNeighborhoods = jest.fn().mockReturnValue(of([]));
  const mockGetCategories = jest.fn().mockReturnValue(of([]));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        HouseFiltersComponent,
        SelectComponent,
        InputComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseFiltersComponent);
    component = fixture.componentInstance;
    
    // Configurar el FormGroup mock
    const fb = TestBed.inject(FormBuilder);
    mockForm = fb.group({
      nameDepartment: [''],
      nameCity: [''],
      neighborhood: [''],
      nameCategory: [''],
      bedroomCount: [''],
      bathroomCount: [''],
      minPrice: [''],
      maxPrice: [''],
      orderBy: ['city'],
      orderAsc: ['true']
    });

    // Asignar inputs
    component.filterForm = mockForm;
    component.getDepartments = mockGetDepartments;
    component.getCities = mockGetCities;
    component.getNeighborhoods = mockGetNeighborhoods;
    component.getCategories = mockGetCategories;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept and use filterForm input', () => {
      expect(component.filterForm).toEqual(mockForm);
    });

    it('should accept service functions as inputs', () => {
      expect(component.getDepartments).toBe(mockGetDepartments);
      expect(component.getCities).toBe(mockGetCities);
    });
  });

  describe('Toggle Advanced Filters', () => {
    it('should emit toggle event when button clicked', () => {
      const toggleSpy = jest.spyOn(component.toggleAdvancedFilters, 'emit');
      const button = fixture.debugElement.query(By.css('.btn-filter'));
      
      button.nativeElement.click();
      
      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should emit submit event on form submit', () => {
      const submitSpy = jest.spyOn(component.submitFilters, 'emit');
      const form = fixture.debugElement.query(By.css('form'));
      
      form.triggerEventHandler('submit', null);
      
      expect(submitSpy).toHaveBeenCalled();
    });
  });

  describe('Reset Filters', () => {
    it('should emit reset event when reset button clicked', () => {
      component.showAdvancedFilters = true;
      fixture.detectChanges();
      
      const resetSpy = jest.spyOn(component.resetFilters, 'emit');
      const resetButton = fixture.debugElement.query(By.css('.btn--third'));
      
      resetButton.nativeElement.click();
      
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('Location Selection', () => {
    it('should emit department id change', () => {
      const deptSpy = jest.spyOn(component.departmentIdChange, 'emit');
      const testId = 5;
      
      component.onDepartmentChange(testId);
      
      expect(deptSpy).toHaveBeenCalledWith(testId);
    });

    it('should emit city id change', () => {
      const citySpy = jest.spyOn(component.cityIdChange, 'emit');
      const testId = 10;
      
      component.onCityChange(testId);
      
      expect(citySpy).toHaveBeenCalledWith(testId);
    });
  });

  describe('Disabled State Helpers', () => {
    it('should return true when department not selected', () => {
      component.idDepartment = 0;
      expect(component.departmentExist()).toBe(true);
    });

    it('should return false when department selected', () => {
      component.idDepartment = 1;
      expect(component.departmentExist()).toBe(false);
    });

    it('should return true when city not selected', () => {
      component.idCity = 0;
      expect(component.cityExist()).toBe(true);
    });

    it('should return false when city selected', () => {
      component.idCity = 1;
      expect(component.cityExist()).toBe(false);
    });
  });

  describe('Advanced Filters Visibility', () => {
    it('should show advanced filters when flag is true', () => {
      component.showAdvancedFilters = true;
      fixture.detectChanges();
      
      const advancedFilters = fixture.debugElement.query(By.css('.filter-options'));
      expect(advancedFilters).toBeTruthy();
    });

    it('should hide advanced filters when flag is false', () => {
      component.showAdvancedFilters = false;
      fixture.detectChanges();
      
      const advancedFilters = fixture.debugElement.query(By.css('.filter-options'));
      expect(advancedFilters).toBeNull();
    });
  });

  describe('Close Advanced Filters', () => {
    it('should emit toggle event when close icon clicked', () => {
      component.showAdvancedFilters = true;
      fixture.detectChanges();
      
      const toggleSpy = jest.spyOn(component.toggleAdvancedFilters, 'emit');
      const closeIcon = fixture.debugElement.query(By.css('.close-icon'));
      
      closeIcon.nativeElement.click();
      
      expect(toggleSpy).toHaveBeenCalled();
    });
  });
});