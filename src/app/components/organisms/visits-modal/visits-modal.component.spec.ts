import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VisitsModalComponent } from './visits-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulerService } from '@app/core/services/api/scheduler/scheduler.service';
import { of } from 'rxjs';
import { Pagination } from '@app/core/models/pagination';
import { Scheduler } from '@app/core/models/scheduler';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { By } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { InputComponent } from '@app/components/atoms/input/input.component';

// Stub para app-input
@Component({
  selector: 'app-input',
  template: ''
})
class InputStubComponent {
  @Input() label!: string;
  @Input() type!: string;
  @Input() showRequiredSymbol!: boolean;
  @Input() formControl!: any;
}

// Stub para app-table
@Component({
  selector: 'app-table',
  template: ''
})
class TableStubComponent {
  @Input() modalColor!: boolean;
  @Input() data!: any[];
  @Input() columns!: TableColumn[];
  @Input() columnActions?: TableColumn[];
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Output() pageChange = new EventEmitter<number>();
}

describe('VisitsModalComponent', () => {
  let component: VisitsModalComponent;
  let fixture: ComponentFixture<VisitsModalComponent>;
  let schedulerService: jest.Mocked<SchedulerService>;

  const mockSchedulers: Scheduler[] = [
    { idHouse: 5, startDate: '2025-01-01T10:00', endDate: '2025-01-01T12:00' }
  ];

  const mockResponse: Pagination<Scheduler> = {
    content: mockSchedulers,
    totalElements: 1,
    totalPages: 1,
    pageSize: PAGINATION_CONSTANTS.SIZE_VISITS,
    pageNumber: PAGINATION_CONSTANTS.PAGE,
    last: true
  };

  beforeEach(async () => {
    const schedulerServiceMock = {
      getSchedulers: jest.fn().mockReturnValue(of(mockResponse))
    };

    await TestBed.configureTestingModule({
      declarations: [VisitsModalComponent, TableStubComponent, InputComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: SchedulerService, useValue: schedulerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitsModalComponent);
    component = fixture.componentInstance;
    schedulerService = TestBed.inject(SchedulerService) as jest.Mocked<SchedulerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.modal__backdrop'));
    expect(modal).toBeNull();
  });

  it('should display modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('.modal__backdrop'));
    expect(modal).not.toBeNull();
  });

  it('should emit close event when close button is clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const closeSpy = jest.spyOn(component.close, 'emit');
    const closeButton = fixture.debugElement.query(By.css('.modal__header__close-button')).nativeElement;
    closeButton.click();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit close event when backdrop is clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const closeSpy = jest.spyOn(component.close, 'emit');
    const backdrop = fixture.debugElement.query(By.css('.modal__backdrop')).nativeElement;
    backdrop.click();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not emit close event when modal container is clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const closeSpy = jest.spyOn(component.close, 'emit');
    const container = fixture.debugElement.query(By.css('.modal__container')).nativeElement;
    container.click();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should update schedulers$ when idHouse changes', fakeAsync(() => {
    // 1. Configuración inicial
    const newIdHouse = 10;
    const mockResponse: Pagination<Scheduler> = {
      content: [{ idHouse: newIdHouse, startDate: '2025-01-01T10:00', endDate: '2025-01-01T12:00' }],
      totalElements: 1,
      totalPages: 1,
      pageSize: component.size,
      pageNumber: component.page,
      last: true
    };

    // Mockear el servicio
    schedulerService.getSchedulers.mockReturnValue(of(mockResponse));

    // Suscribirse para activar el flujo
    let schedulers: Scheduler[] = [];
    component.schedulers$.subscribe(data => schedulers = data);

    // 2. Cambiar el idHouse
    component.idHouse = newIdHouse;
    component.ngOnChanges({
      idHouse: { 
        currentValue: newIdHouse, 
        previousValue: 5, 
        firstChange: false, 
        isFirstChange: () => false 
      }
    });
    tick();
    fixture.detectChanges();

    // 3. Verificaciones
    expect(schedulerService.getSchedulers).toHaveBeenCalledWith(
      PAGINATION_CONSTANTS.PAGE, // Debería resetear a página 1
      component.size,
      null,
      null,
      newIdHouse
    );
    
    expect(schedulers).toEqual(mockResponse.content);
    expect(component.totalItems).toBe(mockResponse.totalElements);
  }));

  it('should update schedulers$ when page changes', fakeAsync(() => {
    // Configuración inicial
    const newPage = 2;
    const mockResponse: Pagination<Scheduler> = {
      content: [{ idHouse: 5, startDate: '2025-01-01T10:00', endDate: '2025-01-01T12:00' }],
      totalElements: 1,
      totalPages: 1,
      pageSize: component.size,
      pageNumber: newPage,
      last: true
    };
    
    // Mockear la respuesta del servicio
    schedulerService.getSchedulers.mockReturnValue(of(mockResponse));

    // Suscribirse a schedulers$ para activar el flujo
    let schedulers: Scheduler[] = [];
    component.schedulers$.subscribe(data => schedulers = data);

    // Actuar: cambiar la página
    component.onPageChange(newPage);
    tick(); // Esperar a que se completen las operaciones asíncronas
    fixture.detectChanges();

    // Verificar
    expect(schedulerService.getSchedulers).toHaveBeenCalledWith(
      newPage,
      component.size,
      null,
      null,
      component.idHouse
    );
    
    // Verificar que los datos se actualizaron
    expect(schedulers).toEqual(mockResponse.content);
    expect(component.page).toBe(newPage);
    expect(component.totalItems).toBe(mockResponse.totalElements);
  }));

  it('should update schedulers$ when filters are applied', fakeAsync(() => {
    component.isOpen = true;
    fixture.detectChanges();

    const startDate = '2025-01-01T10:00';
    const endDate = '2025-01-02T12:00';
    component.filterForm.setValue({ startDate, endDate });
    component.filterChange();
    tick();
    fixture.detectChanges();

    expect(schedulerService.getSchedulers).toHaveBeenCalledWith(
      PAGINATION_CONSTANTS.PAGE, // Página reseteada
      component.size,
      startDate,
      endDate,
      component.idHouse
    );
  }));

  it('should pass correct data to app-table', fakeAsync(() => {
    component.isOpen = true;
    fixture.detectChanges();
    tick();

    const table = fixture.debugElement.query(By.directive(TableStubComponent));
    expect(table.componentInstance.data).toEqual(mockSchedulers);
    expect(table.componentInstance.columns).toEqual(TABLE_COLUMNS.SCHEDULERS);
    expect(table.componentInstance.currentPage).toBe(PAGINATION_CONSTANTS.PAGE);
    expect(table.componentInstance.itemsPerPage).toBe(PAGINATION_CONSTANTS.SIZE_VISITS);
    expect(table.componentInstance.totalItems).toBe(mockResponse.totalElements);
    expect(table.componentInstance.modalColor).toBe(true);
  }));

  it('should pass columnActions to app-table when provided', () => {
    const mockColumnActions: TableColumn[] = [{ type: 'action', key: 'Actions' }];
    component.columnAction = mockColumnActions;
    component.isOpen = true;
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(TableStubComponent));
    expect(table.componentInstance.columnActions).toEqual(mockColumnActions);
  });

  it('should initialize filter form with null values', () => {
    expect(component.filterForm.value).toEqual({ startDate: null, endDate: null });
  });
});