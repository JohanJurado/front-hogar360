import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SchedulerPageComponent } from './scheduler-page.component';
import { ReactiveFormsModule, FormBuilder, AbstractControl } from '@angular/forms';
import { HouseService } from '@app/core/services/api/house/house.service';
import { SchedulerService } from '@app/core/services/api/scheduler/scheduler.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of, throwError } from 'rxjs';
import { House } from '@app/core/models/house';
import { Scheduler } from '@app/core/models/scheduler';
import { RouterTestingModule } from '@angular/router/testing';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { SaveDtoResponse } from '@app/core/models/dtos/saveDtoResponse';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from '@app/core/models/pagination';

@Component({
  selector: 'app-table',
  template: ''
})
class MockTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() columnActions: any[] = [];
  @Input() currentPage: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() actionClick = new EventEmitter<any>();
}

describe('SchedulerPageComponent', () => {
  let component: SchedulerPageComponent;
  let fixture: ComponentFixture<SchedulerPageComponent>;
  let houseService: jest.Mocked<HouseService>;
  let schedulerService: jest.Mocked<SchedulerService>;
  let notificationService: jest.Mocked<NotificationService>;
  let translatorService: jest.Mocked<TranslatorService>;

  const mockHouse: House = {
    id: 1,
    name: 'Casa de prueba',
    description: 'Descripción',
    price: 100000,
    bedroomCount: 3,
    bathroomCount: 2,
    neighborhood: 'example',
    cityName: 'example',
    departmentName: 'example',
    categoryName: 'example'
  };

  const mockResponse: SaveDtoResponse = { message: 'Scheduler created successfully', time: '' };

  beforeEach(async () => {
    const houseServiceMock = {
      getHouses: jest.fn().mockReturnValue(of({
        content: [mockHouse],
        totalElements: 1
      }))
    };

    const schedulerServiceMock = {
      createScheduler: jest.fn()
    };

    const notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    const translatorServiceMock = {
      translate: jest.fn().mockImplementation((text) => text)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SchedulerPageComponent, InputComponent, MockTableComponent],
      providers: [
        FormBuilder,
        { provide: HouseService, useValue: houseServiceMock },
        { provide: SchedulerService, useValue: schedulerServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: TranslatorService, useValue: translatorServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulerPageComponent);
    component = fixture.componentInstance;

    houseService = TestBed.inject(HouseService) as jest.Mocked<HouseService>;
    schedulerService = TestBed.inject(SchedulerService) as jest.Mocked<SchedulerService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    translatorService = TestBed.inject(TranslatorService) as jest.Mocked<TranslatorService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.schedulerForm.value).toEqual({
        idHouse: null,
        startDate: null,
        endDate: null
      });
    });

    it('should have required validators', () => {
      expect(component.schedulerForm.get('idHouse')?.hasError('required')).toBeTruthy();
      expect(component.schedulerForm.get('startDate')?.hasError('required')).toBeTruthy();
      expect(component.schedulerForm.get('endDate')?.hasError('required')).toBeTruthy();
    });
  });

  describe('onActionClick', () => {
    it('should set houseNewScheduler and update form when action is new-scheduler', () => {
      const event = { obj: mockHouse, action: 'new-scheduler' };
      component.onActionClick(event);

      expect(component.houseNewScheduler).toEqual(mockHouse);
      expect(component.schedulerForm.value.idHouse).toBe(mockHouse.id);
    });

    it('should set houseListVisits when action is list-schedulers', () => {
      const event = { obj: mockHouse, action: 'list-schedulers' };
      component.onActionClick(event);

      expect(component.idHouseListVisits).toEqual(mockHouse.id);
      expect(component.schedulerForm.value.idHouse).toBe(null);
    });
  });

  describe('startDateValidator', () => {
    it('should return null for valid start date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const control = { value: tomorrow.toISOString() };

      const result = component.startDateValidator(control as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return error for invalid start date (past date)', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const control = { value: yesterday.toISOString() };

      const result = component.startDateValidator(control as AbstractControl);
      expect(result).toEqual({ invalidStartDate: true });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.schedulerForm.patchValue({
        idHouse: 1,
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString()
      });
    });

    it('should not submit if form is invalid and mark all controls as touched', () => {
      component.schedulerForm.patchValue({
        idHouse: 1,
        startDate: null,
        endDate: null
      });
      const markAllAsTouchedSpy = jest.spyOn(component.schedulerForm, 'markAllAsTouched');

      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(schedulerService.createScheduler).not.toHaveBeenCalled();
      expect(notificationService.error).not.toHaveBeenCalled();
      expect(component.schedulerForm.get('startDate')?.touched).toBeTruthy();
      expect(component.schedulerForm.get('endDate')?.touched).toBeTruthy();
    });

    it('should show error if no house is selected', () => {
      component.schedulerForm.patchValue({ idHouse: 0 });
      component.onSubmit();

      expect(schedulerService.createScheduler).not.toHaveBeenCalled();
      expect(notificationService.error).toHaveBeenCalledWith('No se selecciono ninguna propiedad');
    });

    it('should call createScheduler with form data when valid and handle success', fakeAsync(() => {
      schedulerService.createScheduler.mockReturnValue(of(mockResponse));

      const formValueBeforeSubmit = { ...component.schedulerForm.value };

      component.onSubmit();
      tick();

      expect(schedulerService.createScheduler).toHaveBeenCalledWith(formValueBeforeSubmit as Scheduler);
      expect(translatorService.translate).toHaveBeenCalledWith(mockResponse.message);
      expect(notificationService.success).toHaveBeenCalledWith(mockResponse.message);
      expect(component.schedulerForm.value).toEqual({
        idHouse: null,
        startDate: null,
        endDate: null
      });
      expect(component.houseNewScheduler).toBeNull();
    }));

    it('should handle error from createScheduler', fakeAsync(() => {
      const mockError = { error: { message: 'Error message' } };
      schedulerService.createScheduler.mockReturnValue(throwError(() => mockError));

      component.onSubmit();
      tick();

      expect(notificationService.error).toHaveBeenCalledWith(mockError.error.message);
    }));

    it('should use default error message when none provided', fakeAsync(() => {
      schedulerService.createScheduler.mockReturnValue(throwError(() => ({})));

      component.onSubmit();
      tick();

      expect(notificationService.error).toHaveBeenCalled();
    }));
  });

  describe('Pagination', () => {
    it('should update page and call onListChange onPageChange', () => {
      component.onPageChange(2);

      expect(component.page).toBe(2);
      expect(houseService.getHouses).toHaveBeenCalled();
    });

    it('should fetch houses with correct parameters and update totalItems onListChange', fakeAsync(() => {
      const mockResponse: Pagination<House> = {
        content: [mockHouse, { ...mockHouse, id: 2 }],
        pageNumber: 0, 
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
        last: true
      };
      houseService.getHouses.mockReturnValue(of(mockResponse));

      component.page = 2;
      component.size = 20;
      component.onListChange();
      tick();

      let houses: House[] = [];
      component.houses$.subscribe(data => {
        houses = data;
      });

      expect(houseService.getHouses).toHaveBeenCalledWith(
        {},
        true,
        2,
        20,
        component.orderBy,
        component.orderAsc
      );
      expect(component.totalItems).toBe(mockResponse.totalElements);
      expect(houses).toEqual(mockResponse.content);
    }));
  });

  describe('formatNumber', () => {
    it('should format number with leading zeros', () => {
      expect(component.formatNumber(5, 3)).toBe('005');
      expect(component.formatNumber(123, 3)).toBe('123');
    });
  });
});