import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should not render if totalItems is 0', () => {
      component.totalItems = 0;
      fixture.detectChanges();
      
      const paginationElement = fixture.debugElement.query(By.css('.pagination'));
      expect(paginationElement).toBeNull();
    });

    it('should render if totalItems is greater than 0', () => {
      component.totalItems = 50;
      component.size = 10;
      component.page = 0;
      fixture.detectChanges();
      
      const paginationElement = fixture.debugElement.query(By.css('.pagination'));
      expect(paginationElement).toBeTruthy();
    });
  });

  describe('Pagination Calculations', () => {
    beforeEach(() => {
      component.totalItems = 100;
      component.size = 10;
    });

    it('should calculate totalPages correctly', () => {
      expect(component.totalPages).toBe(10);
      
      component.totalItems = 101;
      expect(component.totalPages).toBe(11);
    });

    it('should calculate startItem correctly', () => {
      component.page = 2;
      expect(component.startItem).toBe(20);
    });

    it('should calculate endItem correctly', () => {
      component.page = 2;
      expect(component.endItem).toBe(30);
      
      component.page = 9;
      expect(component.endItem).toBe(100);
    });

    it('should generate correct page range', () => {
      // Caso inicial
      component.page = 0;
      expect(component.getPageRange()).toEqual([0, 1, 2, 3]);
      
      // Caso medio
      component.page = 5;
      expect(component.getPageRange()).toEqual([3, 4, 5, 6]);
      
      // Caso final
      component.page = 9;
      expect(component.getPageRange()).toEqual([7, 8, 9]);
    });
  });

  describe('Navigation Buttons', () => {
    beforeEach(() => {
      component.totalItems = 100;
      component.size = 10;
      fixture.detectChanges();
    });

    it('should disable previous button on first page', () => {
      component.page = 0;
      fixture.detectChanges();
      
      const prevButton = fixture.debugElement.query(By.css('.pagination-button.arrow.rotate'));
      expect(prevButton.nativeElement.disabled).toBeTruthy();
    });

    it('should disable next button on last page', () => {
      component.page = 9;
      fixture.detectChanges();
      
      const nextButton = fixture.debugElement.query(By.css('.pagination-button.arrow:not(.rotate)'));
      expect(nextButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable navigation buttons when not on first/last page', () => {
      component.page = 5;
      fixture.detectChanges();
      
      const prevButton = fixture.debugElement.query(By.css('.pagination-button.arrow.rotate'));
      const nextButton = fixture.debugElement.query(By.css('.pagination-button.arrow:not(.rotate)'));
      
      expect(prevButton.nativeElement.disabled).toBeFalsy();
      expect(nextButton.nativeElement.disabled).toBeFalsy();
    });

    it('should highlight current page button', () => {
      component.page = 3;
      fixture.detectChanges();
      
      const activeButton = fixture.debugElement.query(By.css('.pagination-button.active'));
      expect(activeButton.nativeElement.textContent.trim()).toBe('4');
    });
  });

  describe('User Interactions', () => {
    let pageChangeSpy: jest.SpyInstance;

    beforeEach(() => {
      component.totalItems = 100;
      component.size = 10;
      component.page = 2;
      // Usar jest.spyOn en lugar de spyOn
      pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
    });

    it('should emit page change when clicking page button', () => {
      const pageButtons = fixture.debugElement.queryAll(By.css('.pagination-button:not(.arrow)'));
      pageButtons[1].triggerEventHandler('click', null); // Click en página 2 (índice 1)
      
      expect(pageChangeSpy).toHaveBeenCalledWith(1);
    });

    it('should emit previous page when clicking prev arrow', () => {
      component.page = 3; // Para que el botón prev no esté disabled
      fixture.detectChanges();
      
      const prevButton = fixture.debugElement.query(By.css('.pagination-button.arrow.rotate'));
      prevButton.triggerEventHandler('click', null);
      
      expect(pageChangeSpy).toHaveBeenCalledWith(2);
    });

    it('should emit next page when clicking next arrow', () => {
      const nextButton = fixture.debugElement.query(By.css('.pagination-button.arrow:not(.rotate)'));
      nextButton.triggerEventHandler('click', null);
      
      expect(pageChangeSpy).toHaveBeenCalledWith(3);
    });

    it('should not emit when clicking disabled prev button', () => {
      component.page = 0; // Primera página
      fixture.detectChanges();
      
      const prevButton = fixture.debugElement.query(By.css('.pagination-button.arrow.rotate'));
      
      // Verificar que el botón está deshabilitado
      expect(prevButton.nativeElement.disabled).toBe(true);
      
      // Intentar hacer click
      prevButton.nativeElement.click();
      
      // Verificar que no se emitió el evento
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });

    it('should not emit when clicking disabled next button', () => {
      component.page = component.totalPages - 1; // Última página
      fixture.detectChanges();
      
      const nextButton = fixture.debugElement.query(By.css('.pagination-button.arrow:not(.rotate)'));
      
      // Verificar que el botón está deshabilitado
      expect(nextButton.nativeElement.disabled).toBe(true);
      
      // Intentar hacer click
      nextButton.nativeElement.click();
      
      // Verificar que no se emitió el evento
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Display Information', () => {
    it('should show correct range information', () => {
      component.totalItems = 100;
      component.size = 10;
      component.page = 3;
      fixture.detectChanges();
      
      const infoElement = fixture.debugElement.query(By.css('.pagination-info'));
      expect(infoElement.nativeElement.textContent).toContain('Mostrando 31-40 de 100');
    });

    it('should show correct last page range', () => {
      component.totalItems = 103;
      component.size = 10;
      component.page = 10;
      fixture.detectChanges();
      
      const infoElement = fixture.debugElement.query(By.css('.pagination-info'));
      expect(infoElement.nativeElement.textContent).toContain('Mostrando 101-103 de 103');
    });
  });
});