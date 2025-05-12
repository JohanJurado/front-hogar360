import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarLinkComponent } from './sidebar-link.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarLinkComponent', () => {
  let component: SidebarLinkComponent;
  let fixture: ComponentFixture<SidebarLinkComponent>; 
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SidebarLinkComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SidebarLinkComponent);
    component = fixture.componentInstance;
    
    // Configuración inicial de inputs
    component.path = '/dashboard';
    component.icon = 'dashboard';
    component.label = 'Dashboard';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should display correct label', () => {
      const span = fixture.debugElement.query(By.css('span'));
      expect(span.nativeElement.textContent).toBe('Dashboard');
    });

    it('should use correct icon path', () => {
      const img = fixture.debugElement.query(By.css('img'));
      expect(img.nativeElement.src).toContain('/assets/img/sidebar-icons/dashboard.svg');
    });

    it('should use correct active icon path when active', () => {
      jest.spyOn(component, 'isActive').mockReturnValue(true);
      fixture.detectChanges();
      
      const img = fixture.debugElement.query(By.css('img'));
      expect(img.nativeElement.src).toContain('/assets/img/sidebar-icons/dashboard-selected.svg');
    });
  });

  describe('Active State', () => {
    it('should have active class when isActive returns true', () => {
      jest.spyOn(component, 'isActive').mockReturnValue(true);
      fixture.detectChanges();
      
      const link = fixture.debugElement.query(By.css('a'));
      expect(link.nativeElement.classList).toContain('active');
    });

    it('should not have active class when isActive returns false', () => {
      jest.spyOn(component, 'isActive').mockReturnValue(false);
      fixture.detectChanges();
      
      const link = fixture.debugElement.query(By.css('a'));
      expect(link.nativeElement.classList).not.toContain('active');
    });
  });

  describe('Navigation', () => {

    it('should call routerLink with correct path', () => {
      component.path = '/dashboard'; // Asegurar que el input está establecido
      fixture.detectChanges();
      
      const link = fixture.debugElement.query(By.css('a'));
      // Usar attributes en lugar de properties
      expect(link.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/dashboard');
    });

    it('should update active state when route changes', () => {
      // Mockear el router.isActive directamente
      const router = TestBed.inject(Router);
      jest.spyOn(router, 'isActive').mockReturnValue(true);
      
      // Cambiar la ruta
      component.path = '/dashboard';
      fixture.detectChanges();
      
      // Verificar que se llamó con los parámetros correctos
      expect(router.isActive).toHaveBeenCalledWith('/dashboard', {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for icon', () => {
      const img = fixture.debugElement.query(By.css('img'));
      expect(img.nativeElement.alt).toBe('Dashboard icon');
    });

    it('should have proper alt text for active icon', () => {
      jest.spyOn(component, 'isActive').mockReturnValue(true);
      const spy =
      fixture.detectChanges();
      
      const img = fixture.debugElement.query(By.css('img'));
      expect(img.nativeElement.alt).toBe('Dashboard icon');
    });
  });
});