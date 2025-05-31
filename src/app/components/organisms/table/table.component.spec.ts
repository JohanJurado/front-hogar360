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
    { 
      key: 'id', 
      title: 'ID', 
      type: 'id', 
      prefix: 'CAT-2025', 
      isActive: false,
      orderAsc: true,
      orderBy: 'id'
    },
    { 
      key: 'name', 
      title: 'Nombre',
      isActive: true,
      orderAsc: false,
      orderBy: 'name'
    },
    { 
      key: 'createdAt', 
      title: 'Fecha', 
      type: 'date' 
    },
    { 
      key: 'description', 
      title: 'Descripción' 
    }
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

    it('should show "No results" message when data is empty', () => {
      component.data = [];
      fixture.detectChanges();
      
      const noResultsRow = debugElement.query(By.css('.not-found'));
      expect(noResultsRow).toBeTruthy();
      expect(noResultsRow.nativeElement.textContent).toContain('No se encontraron resultados');
    });
  });

  describe('Column formatting', () => {
    it('should format ID correctly with prefix and zeros', () => {
      const idCell = debugElement.query(By.css('.id'));
      expect(idCell.nativeElement.textContent.trim()).toBe('CAT-2025001');
    });

    it('should format date correctly using date pipe', () => {
      const datePipe = TestBed.inject(DatePipe);
      const expectedDate = datePipe.transform(mockData[0].createdAt, 'dd/MM/yyyy');
      
      const dateCells = debugElement.queryAll(By.css('span'));
      const dateCell = dateCells.find(el => 
        el.nativeElement.textContent.includes(expectedDate!)
      );
      expect(dateCell).toBeTruthy();
    });

    it('should display default text for regular columns', () => {
      const cells = debugElement.queryAll(By.css('td'));
      const nameCell = cells.find(cell => 
        cell.nativeElement.textContent.includes('Casa')
      );
      expect(nameCell).toBeTruthy();
    });
  });

  describe('Sorting functionality', () => {
    it('should display sort icons correctly', () => {
      const sortIcons = debugElement.queryAll(By.css('img[alt^="filter"]'));
      expect(sortIcons.length).toBe(mockColumns.filter(c => c.isActive != null).length);
      
      // Verificar icono activo descendente (name column)
      const activeDescIcon = debugElement.query(By.css('img[alt="filter-active-des"]'));
      expect(activeDescIcon).toBeTruthy();
    });

    it('should emit order event when clicking sort icon', () => {
      jest.spyOn(component.order, 'emit');
      const sortIcon = debugElement.query(By.css('img[alt="filter-active-des"]'));
      
      sortIcon.nativeElement.click();
      
      expect(component.order.emit).toHaveBeenCalledWith({ 
        orderBy: 'name', 
        orderAsc: true // Cambia de false a true
      });
    });

    it('should activate new column when clicking inactive column', () => {
      const idColumn = mockColumns.find(c => c.key === 'id')!;
      const sortIcon = debugElement.query(By.css('img[alt="filter-inactive"]'));
      
      sortIcon.nativeElement.click();
      fixture.detectChanges();
      
      expect(idColumn.isActive).toBe(true);
      expect(idColumn.orderAsc).toBe(false);
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

  describe('Action buttons', () => {
    it('should render action buttons column', () => {
      const actionHeader = debugElement.query(By.css('th.actions'));
      expect(actionHeader).toBeTruthy();
      
      const actionCells = debugElement.queryAll(By.css('.actions-cell'));
      expect(actionCells.length).toBe(mockData.length);
    });
  });
    
  describe('newOrder method', () => {
    it('should set orderAsc to true when it is initially null', () => {
      const testColumns: TableColumn[] = [
        { 
          key: 'test', 
          title: 'Test Column',
          isActive: false,
          orderAsc: null,
          orderBy: 'test'
        }
      ];
      component.columns = testColumns;
      
      component.newOrder('test');
      
      const testColumn = component.columns.find(c => c.key === 'test');
      expect(testColumn?.orderAsc).toBe(true);
      
      jest.spyOn(component.order, 'emit');
      component.newOrder('test');
      expect(component.order.emit).toHaveBeenCalledWith({ 
        orderAsc: false,
        orderBy: 'test', 
      });
    });
  });
});