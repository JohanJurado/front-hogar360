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
  let tokenService: jest.Mocked<TokenService>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TopNavbarComponent],
      providers: [
        {
          provide: TokenService,
          useValue: {
            removeToken: jest.fn(),
            getRole: jest.fn().mockReturnValue('ADMIN')
          }
        },
        {
          provide: NotificationService,
          useValue: {
            success: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService) as jest.Mocked<TokenService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should not display profile name when home_template is true', () => {
      component.profile = 'John Doe';
      component.home_template = true;
      fixture.detectChanges();
      
      const welcomeText = fixture.debugElement.query(By.css('p'));
      expect(welcomeText).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home when logo is clicked', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const logo = fixture.debugElement.query(By.css('.navbar__logo'));
      
      logo.triggerEventHandler('click', null);
      
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should navigate to dashboard when "Volver al panel" is clicked', () => {
      component.activeSession = true;
      component.home_template = true;
      fixture.detectChanges();
      
      const userButton = fixture.debugElement.query(By.css('.btn-img'));
      userButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      
      const navigateSpy = jest.spyOn(router, 'navigate');
      const dashboardOption = fixture.debugElement.queryAll(By.css('.option'))[0];
      dashboardOption.triggerEventHandler('click', null);
      
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
    });
  });

  describe('User Menu', () => {
    beforeEach(() => {
      component.activeSession = true;
      component.profile = 'Test User';
      fixture.detectChanges();
    });

    it('should toggle profile options menu when clicked', () => {
      const userButton = fixture.debugElement.query(By.css('.btn-img'));
      
      userButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.modalOptionsProfile).toBe(true);
      
      userButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.modalOptionsProfile).toBe(false);
    });

    it('should display logout option', () => {
      const userButton = fixture.debugElement.query(By.css('.btn-img'));
      userButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      
      const logoutOption = fixture.debugElement.query(By.css('.log-out'));
      expect(logoutOption.nativeElement.textContent).toContain('Cerrar Sesión');
    });
  });

  describe('Logout', () => {
    it('should call tokenService.removeToken and show notification', () => {
      component.activeSession = true;
      fixture.detectChanges();
      
      const userButton = fixture.debugElement.query(By.css('.btn-img'));
      userButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      
      const logoutOption = fixture.debugElement.query(By.css('.log-out'));
      logoutOption.triggerEventHandler('click', null);
      
      expect(tokenService.removeToken).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith('Sesión finalizada exitosamente');
    });

    it('should navigate to home after logout', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      
      component.logout();
      
      expect(navigateSpy).toHaveBeenCalledWith(['']);
    });

    it('should set activeSession to false after logout', () => {
      component.activeSession = true;
      component.logout();
      
      expect(component.activeSession).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for all images', () => {
      component.activeSession = true;
      fixture.detectChanges();
      
      const images = fixture.debugElement.queryAll(By.css('img'));
      images.forEach(img => {
        expect(img.nativeElement.alt).toBeTruthy();
      });
    });
  });

  describe('Role-based Navigation', () => {
    it('should navigate to correct dashboard based on user role', () => {
      const roles = ['ADMIN', 'USER', 'EDITOR'];
      const navigateSpy = jest.spyOn(router, 'navigate');
      
      roles.forEach(role => {
        tokenService.getRole.mockReturnValue(role);
        component.redirectDashboard();
        expect(navigateSpy).toHaveBeenCalledWith([`/${role.toLowerCase()}/dashboard`]);
      });
    });
  });
});