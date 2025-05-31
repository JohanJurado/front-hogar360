import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-house-filters',
  templateUrl: './house-filters.component.html',
  styleUrls: ['./house-filters.component.scss']
})
export class HouseFiltersComponent {
  @Input() filterForm!: FormGroup;
  
  @Input() getDepartments!: (name: string) => Observable<any[]>;
  @Input() getCities!: (name: string, id: number) => Observable<any[]>;
  @Input() getNeighborhoods!: (name: string, id: number) => Observable<any[]>;
  @Input() getCategories!: (name: string) => Observable<any[]>;
  
  @Input() showAdvancedFilters = false;
  @Input() idDepartment = 0;
  @Input() idCity = 0;
  
  @Output() toggleAdvancedFilters = new EventEmitter<void>();
  @Output() submitFilters = new EventEmitter<void>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() departmentIdChange = new EventEmitter<number>();
  @Output() cityIdChange = new EventEmitter<number>();

  onToggleAdvanced() {
    this.toggleAdvancedFilters.emit();
  }

  onSubmit() {
    this.submitFilters.emit();
  }

  onReset() {
    this.resetFilters.emit();
  }

  onDepartmentChange(id: number) {
    this.departmentIdChange.emit(id);
  }

  onCityChange(id: number) {
    this.cityIdChange.emit(id);
  }

  departmentExist(): boolean {
    return this.idDepartment === 0;
  }

  cityExist(): boolean {
    return this.idCity === 0;
  }
}