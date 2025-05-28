import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavbarComponent } from './top-navbar.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TokenService } from '@app/core/services/api/auth/token.service';
import { NotificationService } from '@app/core/services/notification/notification.service';

describe('TopNavbarComponent', () => {
  let component: TopNavbarComponent;
  let fixture: ComponentFixture<TopNavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TopNavbarComponent],
      providers: [
        { provide: TokenService, useValue: { removeToken: jest.fn() } },
        { provide: NotificationService, useValue: { success: jest.fn() } }
      ]
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
      expect(userElement.nativeElement.textContent).toContain('Bienvenido');
    });

    it('should display custom text when input provided', () => {
      component.profile = 'John Doe';
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

  describe('Logout', () => {
  it('should remove token, show success notification and navigate to home', () => {
    const removeTokenSpy = jest.spyOn(component.tokenService, 'removeToken');
    const notificationSpy = jest.spyOn(component.notificationService, 'success');
    const navigateSpy = jest.spyOn(component.router, 'navigate');
    
    component.logout(); 
    
    expect(removeTokenSpy).toHaveBeenCalled();
    expect(notificationSpy).toHaveBeenCalledWith('Sesión finalizada exitosamente');
    expect(navigateSpy).toHaveBeenCalledWith(['']);
    });
  }); 

  describe('Login Button', () => {
  it('should navigate to login when button is clicked', () => {
    component.layout = false;
    fixture.detectChanges();
    
    const navigateSpy = jest.spyOn(component.router, 'navigate');
    const loginButton = fixture.debugElement.query(By.css('.btn--primary'));
    
    loginButton.triggerEventHandler('click', null);
    
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});

describe('Profile Options Modal Display', () => {
  it('should show profile options when user image is clicked', () => {
    component.layout = true;
    component.profile = 'Test User';
    fixture.detectChanges();
    
    const userImage = fixture.debugElement.query(By.css('.navbar__user img'));
    userImage.triggerEventHandler('click', null);
    
    fixture.detectChanges();
    
    const optionsProfile = fixture.debugElement.query(By.css('.options-profile'));
    expect(optionsProfile).toBeTruthy();
    expect(component.modalOptionsProfile).toBe(true);
  });
});

describe('Layout Variations', () => {
  it('should show user section when layout is true', () => {
    component.layout = true;
    component.profile = 'Test User';
    fixture.detectChanges();
    
    const userSection = fixture.debugElement.query(By.css('.navbar__user'));
    expect(userSection).toBeTruthy();
    expect(userSection.nativeElement.textContent).toContain('Test User');
  });

  it('should show options section when layout is false', () => {
    component.layout = false;
    fixture.detectChanges();
    
    const optionsSection = fixture.debugElement.query(By.css('.navbar__options'));
    expect(optionsSection).toBeTruthy();
  });
});
});