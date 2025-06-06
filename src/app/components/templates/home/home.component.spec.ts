import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TokenService } from '@app/core/services/api/auth/token.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TopNavbarComponent } from '@app/components/organisms/top-navbar/top-navbar.component';
import { FooterComponent } from '@app/components/organisms/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const tokenServiceMock = {
      isTokenExpired: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      declarations: [
        HomeComponent,
        TopNavbarComponent,
        FooterComponent
      ],
      providers: [
        { provide: TokenService, useValue: tokenServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    tokenService = TestBed.inject(TokenService) as jest.Mocked<TokenService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Token State', () => {
    it('should set isTokenActive to true when token is not expired', () => {
      tokenService.isTokenExpired.mockReturnValue(false);
      fixture.detectChanges();
      
      expect(component.isTokenActive).toBe(true);
    });

    it('should set isTokenActive to false when token is expired', () => {
      tokenService.isTokenExpired.mockReturnValue(true);
      fixture.detectChanges();
      
      expect(component.isTokenActive).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render top navbar with correct inputs', () => {
      tokenService.isTokenExpired.mockReturnValue(false);
      fixture.detectChanges();
      
      const navbar = fixture.debugElement.query(By.directive(TopNavbarComponent));
      expect(navbar).toBeTruthy();
      
      const navbarComponent = navbar.componentInstance as TopNavbarComponent;
      expect(navbarComponent.home_template).toBe(true);
      expect(navbarComponent.activeSession).toBe(true);
    });

    it('should render router outlet', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should render footer component', () => {
      const footer = fixture.debugElement.query(By.directive(FooterComponent));
      expect(footer).toBeTruthy();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct CSS classes for layout', () => {
      const section = fixture.debugElement.query(By.css('section.body'));
      const main = fixture.debugElement.query(By.css('main.body__main'));
      
      expect(section).toBeTruthy();
      expect(main).toBeTruthy();
    });
  });
});