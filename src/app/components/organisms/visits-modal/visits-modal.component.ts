import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { Pagination } from '@app/core/models/pagination';
import { Scheduler } from '@app/core/models/scheduler';
import { SchedulerService } from '@app/core/services/api/scheduler/scheduler.service';
import { PAGINATION_CONSTANTS } from '@app/shared/constants/pagination';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';


@Component({
  selector: 'app-visits-modal',
  templateUrl: './visits-modal.component.html',
  styleUrls: ['./visits-modal.component.scss']
})
export class VisitsModalComponent {
  @Input() isOpen = false;
  @Input() idHouse: number = 5;
  @Input() columnAction? : TableColumn[];

  @Output() close = new EventEmitter<void>();
  @Output() newVisit = new EventEmitter<number>();

  onClose(): void {
    this.close.emit();
  }

  page: number = PAGINATION_CONSTANTS.PAGE;
  size: number = PAGINATION_CONSTANTS.SIZE_VISITS;
  totalItems: number = PAGINATION_CONSTANTS.TOTAL_ITEMS;
  
  columns: TableColumn[] = TABLE_COLUMNS.SCHEDULERS as TableColumn[];

  private readonly fb = inject(FormBuilder);
  filterForm = this.fb.group ({
    startDate: [null as string | null],
    endDate: [null as string | null],
  });

  get startDateControl(): FormControl {
    return this.filterForm.get('startDate') as FormControl;
  }

  get endDateControl(): FormControl {
    return this.filterForm.get('endDate') as FormControl;
  }

  private readonly schedulerService = inject(SchedulerService);
  private readonly idHouseSubject = new BehaviorSubject<number>(this.idHouse);
  private readonly pageSubject = new BehaviorSubject<number>(this.page);
  private readonly sizeSubject = new BehaviorSubject<number>(this.size);

  schedulers$: Observable<Scheduler[]> = combineLatest([
    this.idHouseSubject,
    this.pageSubject,
    this.sizeSubject
  ]).pipe(
    switchMap(([idHouse, page, size]) =>
      this.schedulerService.getSchedulers(page, size, this.filterForm.value.startDate, this.filterForm.value.endDate, idHouse).pipe(
        map((response: Pagination<Scheduler>) => {          
          this.totalItems = response.totalElements;
          return response.content;
        })
      )
    )
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idHouse'] && changes['idHouse'].currentValue !== changes['idHouse'].previousValue) {
      this.idHouseSubject.next(changes['idHouse'].currentValue);
    }
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.pageSubject.next(this.page);
  }

  filterChange(){
    this.pageSubject.next(this.page);
  }

  newVisitAction(event: { obj: Scheduler; action: string; }){
    this.newVisit.emit(event.obj.id);
  }
}
