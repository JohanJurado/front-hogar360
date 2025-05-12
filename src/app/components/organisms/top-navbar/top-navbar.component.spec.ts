import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavbarComponent } from './top-navbar.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('TopNavbarComponent', () => {
  let component: TopNavbarComponent;
  let fixture: ComponentFixture<TopNavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Necesario para pruebas de navegación
      declarations: [TopNavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should display default text when no input provided', () => {
      const userElement = fixture.debugElement.query(By.css('.navbar__user'));
      expect(userElement.nativeElement.textContent).toContain('Bienvenido, Admin');
    });

    it('should display custom text when input provided', () => {
      component.text = 'John Doe';
      fixture.detectChanges();
      
      const userElement = fixture.debugElement.query(By.css('.navbar__user'));
      expect(userElement.nativeElement.textContent).toContain('Bienvenido, John Doe');
    });
  });

  describe('Navigation', () => {
    it('should navigate to home when logo is clicked', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const logo = fixture.debugElement.query(By.css('.navbar__logo'));
      
      logo.triggerEventHandler('click', null);
      
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Accessibility', () => {
    it('should have alt text for logo image', () => {
      const logoImg = fixture.debugElement.query(By.css('.navbar__logo img'));
      expect(logoImg.nativeElement.alt).toBe('Logo');
    });

    it('should have alt text for user image', () => {
      const userImg = fixture.debugElement.query(By.css('.navbar__user img'));
      expect(userImg.nativeElement.alt).toBe('Logo');
    });
  });
});