import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { House } from '@app/core/models/house';
import { Scheduler } from '@app/core/models/scheduler';
import { HouseService } from '@app/core/services/api/house/house.service';
import { SchedulerService } from '@app/core/services/api/scheduler/scheduler.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';
import { map } from 'rxjs';

@Component({
  selector: 'app-scheduler-page',
  templateUrl: './scheduler-page.component.html',
  styleUrls: ['./scheduler-page.component.scss']
})
export class SchedulerPageComponent {
  page: number = PAGINATION_CONSTANTS.PAGE;
  size: number = PAGINATION_CONSTANTS.SIZE;
  orderBy: string = PAGINATION_CONSTANTS.ORDER_BY;
  orderAsc: boolean = PAGINATION_CONSTANTS.ORDER_ASC;
  totalItems: number = PAGINATION_CONSTANTS.TOTAL_ITEMS;

  columns: TableColumn[] = TABLE_COLUMNS.HOUSES as TableColumn[];
  columnActions: TableColumn[] = TABLE_COLUMNS.HOUSES_ACTIONS as TableColumn[];

  houseNewScheduler: House | null = null;
  houseListVisits: House | null = null;

  private readonly notificationService = inject(NotificationService);
  private readonly translatorService = inject(TranslatorService);
  private readonly schedulerService = inject(SchedulerService);
  private readonly houseService = inject(HouseService);
  
  houses$ = this.houseService.getHouses({}, true, this.page, this.size, this.orderBy, this.orderAsc).pipe(
    map(response => {
      this.totalItems = response.totalElements;
      return response.content;
    })
  );

  private readonly fb = inject(FormBuilder);
  public schedulerForm: FormGroup<{
    idHouse: FormControl<number | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
  }> = this.fb.group({
    idHouse: [null as number | null, [Validators.required]],
    startDate: [null as string | null, [Validators.required, this.startDateValidator]],
    endDate: [null as string | null, [Validators.required]],
  });

  get startDateControl(): FormControl<string | null> {
    return this.schedulerForm.get('startDate') as FormControl<string | null>;
  }

  get endDateControl(): FormControl<string | null> {
    return this.schedulerForm.get('endDate') as FormControl<string | null>;
  }

  startDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const startDate = new Date(control.value);
    const today = new Date();
    
    let minDate = new Date();
    let maxDate = new Date();

    minDate.setHours(today.getHours() + 1);
    maxDate.setDate(today.getDay() + 21);
    
    return startDate >= minDate && startDate <= maxDate ? null : { invalidStartDate: true };
  }

  onActionClick(event: { obj: House, action: string }) {
    if (event.action === 'new-scheduler') {
      this.houseNewScheduler = event.obj;
      this.schedulerForm.patchValue({
        idHouse: event.obj.id
      });
    } else if (event.action === 'list-schedulers') {
      this.houseListVisits = event.obj;
    }
  }

  formatNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.onListChange();
  }

  onListChange() {
    this.houses$ = this.houseService.getHouses({}, true, this.page, this.size, this.orderBy, this.orderAsc).pipe(
      map(response => {
        this.totalItems = response.totalElements;
        return response.content;
      })
    );
  }

  onSubmit() {
    if (this.schedulerForm.invalid) {
      this.schedulerForm.markAllAsTouched();
      return;
    }

    if (this.schedulerForm.value.idHouse === 0) {
      this.notificationService.error('No se selecciono ninguna propiedad');
      return;
    }

    this.schedulerService.createScheduler(this.schedulerForm.value as Scheduler).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.schedulerForm.reset();
        this.houseNewScheduler = null;
      },
      error: (error) => {
        const message = error?.error?.message ?? FORM_MESSAGES.ERROR;
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }
}