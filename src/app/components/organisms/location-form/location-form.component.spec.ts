import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { LocationFormComponent } from './location-form.component';
import { LocationService } from '@app/core/services/api/location/location.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SelectComponent } from '@app/components/molecules/select/select.component';

describe('LocationFormComponent', () => {
  let component: LocationFormComponent;
  let fixture: ComponentFixture<LocationFormComponent>;
  let locationService: jest.Mocked<LocationService>;
  let notificationService: jest.Mocked<NotificationService>;
  let translatorService: jest.Mocked<TranslatorService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LocationFormComponent, SelectComponent, InputComponent],
      providers: [
        FormBuilder,
        {
          provide: LocationService,
          useValue: {
            getDepartments: jest.fn(),
            getCities: jest.fn(),
            createLocation: jest.fn()
          }
        },
        {
          provide: NotificationService,
          useValue: {
            success: jest.fn(),
            error: jest.fn()
          }
        },
        {
          provide: TranslatorService,
          useValue: {
            translate: jest.fn().mockImplementation(text => text)
          }
        }
      ]
    }).compileComponents();

    // Obtener instancias de los servicios mockeados
    locationService = TestBed.inject(LocationService) as jest.Mocked<LocationService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;

    // Configurar mocks por defecto
    locationService.getDepartments.mockReturnValue(of([{id: 1, name: 'Test Department', description: ''}]));
    locationService.getCities.mockReturnValue(of([{id: 1, name: 'Test City', description: '' }]));
    locationService.createLocation.mockReturnValue(of({ message: 'Success', time: '' }));

    fixture = TestBed.createComponent(LocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.locationForm.value).toEqual({
        nameDepartment: '',
        nameCity: '',
        neighborhood: ''
      });
    });

    it('should have required validators', () => {
      expect(component.departmentNameControl.errors?.['required']).toBeTruthy();
      expect(component.cityNameControl.errors?.['required']).toBeTruthy();
      expect(component.neighborhoodControl.errors?.['required']).toBeTruthy();
    });

    it('should have max length validators', () => {
      const longName = 'a'.repeat(91);
      const longNeighborhood = 'a'.repeat(121);

      component.departmentNameControl.setValue(longName);
      component.neighborhoodControl.setValue(longNeighborhood);

      expect(component.departmentNameControl.errors?.['maxlength']).toBeTruthy(); 
      expect(component.neighborhoodControl.errors?.['maxlength']).toBeTruthy();
    });
  });

  describe('Department and City Selection', () => {
    it('should set department ID', () => {
      component.setDepartmentId(5);
      expect(component.idDepartment).toBe(5);
    });

    it('should set city ID', () => {
      component.setCityId(10);
      expect(component.idCity).toBe(10);
    });

    it('departmentExist should return correct boolean', () => {
      component.idDepartment = 0;
      expect(component.departmentExist()).toBe(true);
      
      component.idDepartment = 1;
      expect(component.departmentExist()).toBe(false);
    });

    it('cityExist should return correct boolean', () => {
      component.idCity = 0;
      expect(component.cityExist()).toBe(true);
      
      component.idCity = 1;
      expect(component.cityExist()).toBe(false);
    });

    it('should call getDepartments service', fakeAsync(() => {
      const testName = 'Test';
      component.getDepartments(testName).subscribe();
      tick();
      
      expect(locationService.getDepartments).toHaveBeenCalledWith(testName);
    }));

    it('should call getCities service with department ID', fakeAsync(() => {
      const testName = 'Test';
      const testId = 1;
      component.getCities(testName, testId).subscribe();
      tick();
      
      expect(locationService.getCities).toHaveBeenCalledWith(testName, testId);
    }));
  });

  describe('Form Submission', () => {
    it('should not submit invalid form', () => {
      component.submit();
      expect(locationService.createLocation).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched on invalid submission', () => {
      component.submit();
      expect(component.departmentNameControl.touched).toBeTruthy();
      expect(component.cityNameControl.touched).toBeTruthy();
      expect(component.neighborhoodControl.touched).toBeTruthy();
    });

    it('should call service with form value on valid submission', () => {
      // Set valid values
      component.departmentNameControl.setValue('Test Department');
      component.cityNameControl.setValue('Test City');
      component.neighborhoodControl.setValue('Test Neighborhood');
      component.setDepartmentId(1);
      component.setCityId(1);
      
      component.submit();
      
      expect(locationService.createLocation).toHaveBeenCalledWith({
        nameDepartment: 'Test Department',
        nameCity: 'Test City',
        neighborhood: 'Test Neighborhood'
      });
    });

    it('should handle successful submission', fakeAsync(() => {
      component.newLocation.emit = jest.fn();

      component.departmentNameControl.setValue('Test Department');
      component.cityNameControl.setValue('Test City');
      component.neighborhoodControl.setValue('Test Neighborhood');
      component.setDepartmentId(1);
      component.setCityId(1);
      
      component.submit();
      tick();
      
      expect(notificationService.success).toHaveBeenCalledWith('Success');
      expect(component.locationForm.pristine).toBeTruthy();
      expect(component.newLocation.emit).toHaveBeenCalledWith(true);
    }));

    it('should handle API errors', fakeAsync(() => {
      const errorResponse = { error: { message: 'API Error' } };
      locationService.createLocation.mockReturnValue(throwError(() => errorResponse));
      
      component.departmentNameControl.setValue('Test Department');
      component.cityNameControl.setValue('Test City');
      component.neighborhoodControl.setValue('Test Neighborhood');
      component.setDepartmentId(1);
      component.setCityId(1);
      
      component.submit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalledWith('API Error');
    }));

        it('should handle undefined error message', fakeAsync(() => {
      locationService.createLocation.mockReturnValue(throwError(() => ({})));
      
      component.departmentNameControl.setValue('Test Department');
      component.cityNameControl.setValue('Test City');
      component.neighborhoodControl.setValue('Test Neighborhood');
      component.setDepartmentId(1);
      component.setCityId(1);
      
      component.submit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalledWith('Ocurrió un error inesperado');
    }));
  });

  describe('UI Integration', () => {
    it('should have correct form controls bound', () => {
      const selects = fixture.debugElement.queryAll(By.directive(SelectComponent));
      const inputs = fixture.debugElement.queryAll(By.directive(InputComponent));
      
      expect(selects.length).toBe(2);
      expect(inputs.length).toBe(1);
      
      const departmentSelect = selects[0].componentInstance as SelectComponent;
      const citySelect = selects[1].componentInstance as SelectComponent;
      const neighborhoodInput = inputs[0].componentInstance as InputComponent;
      
      expect(departmentSelect.formControl).toBe(component.departmentNameControl);
      expect(citySelect.formControl).toBe(component.cityNameControl);
      expect(neighborhoodInput.formControl).toBe(component.neighborhoodControl);
    });

    it('should disable submit button when form is invalid', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTruthy();
    });
 
    it('should enable submit button when form is valid', () => {
      component.departmentNameControl.setValue('Test Department');
      component.cityNameControl.setValue('Test City');
      component.neighborhoodControl.setValue('Test Neighborhood');
      component.setDepartmentId(1);
      component.setCityId(1);
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalsy();
    });

    it('should disable city select when no department is selected', () => {
      component.idDepartment = 0;
      fixture.detectChanges();
      
      const selects = fixture.debugElement.queryAll(By.directive(SelectComponent));
      const citySelect = selects[1].componentInstance as SelectComponent;
      
      expect(citySelect.disabled).toBe(true);
    });

    it('should disable neighborhood input when no city is selected', () => {
      component.idCity = 0;
      fixture.detectChanges();
      
      const input = fixture.debugElement.query(By.directive(InputComponent));
      const neighborhoodInput = input.componentInstance as InputComponent;
      
      expect(neighborhoodInput.disabled).toBe(true);
    });
  });

  describe('Dependent Selects', () => {
    it('should enable city select when department is selected', () => {
      component.idDepartment = 1;
      fixture.detectChanges();
      
      const selects = fixture.debugElement.queryAll(By.directive(SelectComponent));
      const citySelect = selects[1].componentInstance as SelectComponent;
      
      expect(citySelect.disabled).toBe(false);
    });

    it('should enable neighborhood input when city is selected', () => {
      component.idCity = 1;
      fixture.detectChanges();
      
      const input = fixture.debugElement.query(By.directive(InputComponent));
      const neighborhoodInput = input.componentInstance as InputComponent;
      
      expect(neighborhoodInput.disabled).toBe(false);
    });
  });
});