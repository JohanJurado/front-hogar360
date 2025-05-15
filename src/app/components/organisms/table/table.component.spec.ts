import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('TableComponent', () => {
  let component: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;
  let debugElement: DebugElement;

  const mockColumns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'id', prefix: 'CAT-2025', width: '120px' },
    { key: 'name', title: 'Nombre' },
    { key: 'createdAt', title: 'Fecha', type: 'date' },
    { key: 'description', title: 'Descripción' }
  ];

  const mockData = [
    { id: 1, name: 'Casa', description: 'Propiedad residencial', createdAt: '2023-01-01' },
    { id: 2, name: 'Apartamento', description: 'Propiedad urbana', createdAt: '2023-01-02' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.columns = mockColumns;
    component.data = mockData;
    component.totalItems = 10;
    component.itemsPerPage = 2;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic functionality', () => {
  it('should render correct number of table headers', () => {
    const headers = debugElement.queryAll(By.css('th'));
    // +1 por la columna de Acciones
    expect(headers.length).toBe(mockColumns.length + 1);
  });

  it('should render correct number of rows', () => {
    const rows = debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockData.length);
  });

  it('should format ID correctly', () => {
    const idCell = debugElement.query(By.css('.id'));
    expect(idCell.nativeElement.textContent.trim()).toBe('CAT-2025001');
  });

  it('should format date correctly', () => {
    const dateCells = debugElement.queryAll(By.css('span'));
    const dateCell = dateCells.find(el => 
      el.nativeElement.textContent.includes('01/01/2023')
    );
    expect(dateCell).toBeTruthy();
  });
});

describe('Pagination', () => {
  it('should calculate totalPages correctly', () => {
    expect(component.totalPages).toBe(5); // 10 items / 2 por página
  });

  it('should calculate startItem and endItem correctly', () => {
    expect(component.startItem).toBe(0);
    expect(component.endItem).toBe(2);
    
    component.currentPage = 1;
    fixture.detectChanges();
    
    expect(component.startItem).toBe(2);
    expect(component.endItem).toBe(4);
  });

  it('should generate correct page range', () => {
    // Con rangeSize = 3 y currentPage = 0
    expect(component.getPageRange()).toEqual([0, 1, 2]);
    
    component.currentPage = 2;
    expect(component.getPageRange()).toEqual([1, 2, 3]);
    
    component.currentPage = 4;
    expect(component.getPageRange()).toEqual([3, 4]);
  });

  it('should disable previous button on first page', () => {
    component.currentPage = 0;
    fixture.detectChanges();
    const prevButton = debugElement.query(By.css('.rotate'));
    expect(prevButton.nativeElement.disabled).toBeTruthy();
  });

  it('should disable next button on last page', () => {
    component.currentPage = 4; // última página (0-based)
    fixture.detectChanges();
    const nextButton = debugElement.query(By.css('.arrow:not(.rotate)'));
    expect(nextButton.nativeElement.disabled).toBeTruthy();
  });

  it('should emit pageChange event when clicking page button', () => {
    jest.spyOn(component.pageChange, 'emit');
    const pageButtons = debugElement.queryAll(By.css('.pagination-button:not(.arrow)'));
    
    pageButtons[1].nativeElement.click(); // Click en página 2 (índice 1)
    
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should show correct pagination info', () => {
    const info = debugElement.query(By.css('.pagination-info'));
    expect(info.nativeElement.textContent).toContain('Mostrando 1-2 de 10');
    
    component.currentPage = 1;
    fixture.detectChanges();
    expect(info.nativeElement.textContent).toContain('Mostrando 3-4 de 10');
  });
});

describe('Helper methods', () => {
  it('should format number with leading zeros', () => {
    expect(component.formatNumber(5, 3)).toBe('005');
    expect(component.formatNumber(123, 3)).toBe('123');
  });

  it('should get nested property correctly', () => {
    const obj = { a: { b: { c: 'value' } } };
    expect(component.getProperty(obj, 'a.b.c')).toBe('value');
    expect(component.getProperty(obj, 'a.b')).toEqual({ c: 'value' });
    expect(component.getProperty(obj, 'nonexistent')).toBeUndefined();
  });

  it('should track by id or index', () => {
    const itemWithId = { id: 123 };
    const itemWithoutId = { name: 'test' };
    
    expect(component.trackByFn(0, itemWithId)).toBe(123);
    expect(component.trackByFn(1, itemWithoutId)).toBe(1);
  });
});

describe('Conditional rendering', () => {
  it('should render id type correctly', () => {
    const idCell = debugElement.query(By.css('.id'));
    expect(idCell).toBeTruthy();
    expect(idCell.nativeElement.textContent).toContain('CAT-2025');
  });

  it('should render date type correctly', () => {
    const datePipe = TestBed.inject(DatePipe);
    const expectedDate = datePipe.transform(mockData[0].createdAt, 'dd/MM/yyyy');
    
    const dateCells = debugElement.queryAll(By.css('span'));
    const dateCell = dateCells.find(el => 
      el.nativeElement.textContent.includes(expectedDate)
    );
    expect(dateCell).toBeTruthy();
  });

  it('should render default type correctly', () => {
    const defaultCells = debugElement.queryAll(By.css('span'));
    const descriptionCell = defaultCells.find(el => 
      el.nativeElement.textContent.includes('Propiedad residencial')
    );
    expect(descriptionCell).toBeTruthy();
  });
});
});