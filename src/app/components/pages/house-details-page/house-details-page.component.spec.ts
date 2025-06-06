import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HouseDetailsPageComponent } from './house-details-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { VisitsModalComponent } from '@app/components/organisms/visits-modal/visits-modal.component';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { House } from '@app/core/models/house';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { VisitService } from '@app/core/services/api/visit/visit.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HouseDetailsPageComponent', () => {
  let component: HouseDetailsPageComponent;
  let fixture: ComponentFixture<HouseDetailsPageComponent>;
  let notificationService: jest.Mocked<NotificationService>;
  let visitService: jest.Mocked<VisitService>;
  let router: Router;

  const mockHouse: House = {
    id: 1,
    name: 'Casa Moderna',
    description: 'Hermosa casa con vista al mar',
    price: 250000,
    bedroomCount: 3,
    bathroomCount: 2,
    categoryName: 'Residencial',
    neighborhood: 'Centro',
    cityName: 'Medellín',
    departmentName: 'Antioquia',
    emailSeller: 'vendedor@example.com'
  };

  beforeEach(async () => {
    const notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    const visitServiceMock = {
      createVisit: jest.fn().mockReturnValue(of({ message: 'Visita agendada' }))
    };

    const translatorServiceMock = {
      translate: jest.fn().mockImplementation(text => text)
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        HouseDetailsPageComponent,
        InputComponent,
        VisitsModalComponent
      ],
      providers: [
        FormBuilder,
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: VisitService, useValue: visitServiceMock },
        { provide: TranslatorService, useValue: translatorServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseDetailsPageComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    visitService = TestBed.inject(VisitService) as jest.Mocked<VisitService>;
    router = TestBed.inject(Router);
    
  const mockNavigation = {
      extras: {
        state: {
          house: mockHouse,
          imgId: 1
        }
      }
    };
    
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigation as any);
    
    fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });

  describe('Initialization', () => {

    it('should fallback to localStorage if router state is empty', () => {
      const mockNullNavigation = {
        extras: {
          state: null
        }
      };
      
      jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNullNavigation as any);
      
      localStorage.setItem('houseDetails', JSON.stringify(mockHouse));
      localStorage.setItem('houseImgDetails', '2');
      
      fixture = TestBed.createComponent(HouseDetailsPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      expect(component.house).toEqual(mockHouse);
      expect(component.imgId).toBe(2);
    });

    it('should initialize email form with required validator', () => {
      expect(component.emailBuyerForm).toBeTruthy();
      expect(component.emailBuyerForm.get('email')?.validator).toBeTruthy();
    });
  });

  describe('Component Methods', () => {
    describe('getHouseImage', () => {
      it('should return correct image path based on index', () => {
        expect(component.getHouseImage(0)).toContain('house-card-img-1.png');
        expect(component.getHouseImage(1)).toContain('house-card-img-2.png');
        expect(component.getHouseImage(2)).toContain('house-card-img-3.png');
        expect(component.getHouseImage(3)).toContain('house-card-img-1.png');
      });
    });

    describe('Modal Control', () => {
      it('should open modal', () => {
        component.openModal();
        expect(component.modalIsOpen).toBe(true);
      });

      it('should close modal', () => {
        component.modalIsOpen = true;
        component.closeModal();
        expect(component.modalIsOpen).toBe(false);
      });
    });

    describe('newVisit', () => {
      it('should create visit and show success message', fakeAsync(() => {
        component.emailBuyerForm.setValue({ email: 'test@example.com' });
        component.newVisit(1);
        tick();
        
        expect(visitService.createVisit).toHaveBeenCalledWith({
          emailBuyer: 'test@example.com',
          idScheduler: 1
        });
        expect(notificationService.success).toHaveBeenCalledWith('Visita agendada');
        expect(component.emailBuyerForm.value.email).toBeNull();
        expect(component.modalIsOpen).toBe(false);
      }));

      it('should handle error when creating visit', fakeAsync(() => {
        const error = { error: { message: 'Error message' } };
        visitService.createVisit.mockReturnValueOnce(throwError(() => error));
        
        component.emailBuyerForm.setValue({ email: 'test@example.com' });
        component.newVisit(1);
        tick();
        
        expect(notificationService.error).toHaveBeenCalledWith('Error message');
      }));

      it('should use default error message when not provided', fakeAsync(() => {
        const error = {};
        visitService.createVisit.mockReturnValueOnce(throwError(() => error));
        
        component.emailBuyerForm.setValue({ email: 'test@example.com' });
        component.newVisit(1);
        tick();
        
        expect(notificationService.error).toHaveBeenCalledWith(FORM_MESSAGES.ERROR);
      }));
    });
  });

  describe('Template Rendering', () => {
    it('should display house details correctly', () => {
      fixture.detectChanges();
      
      const nameElement = fixture.debugElement.query(By.css('.content__house-info__name'));
      expect(nameElement.nativeElement.textContent).toContain(mockHouse.name);
      
      const priceElement = fixture.debugElement.query(By.css('.content__house-info__description'));
      expect(priceElement.nativeElement.textContent).toContain('Hermosa casa con vista al mar');
      
      const bedroomElement = fixture.debugElement.queryAll(By.css('.details-items p'))[0];
      expect(bedroomElement.nativeElement.textContent).toContain(mockHouse.bedroomCount.toString());
    });

    it('should render input and buttons', () => {
      fixture.detectChanges();
      
      const input = fixture.debugElement.query(By.directive(InputComponent));
      expect(input).toBeTruthy();
      
      const buttons = fixture.debugElement.queryAll(By.css('.btn'));
      expect(buttons.length).toBe(2);
      expect(buttons[0].nativeElement.textContent).toContain('Agendar');
      expect(buttons[1].nativeElement.textContent).toContain('Atras');
    });

    it('should disable Agendar button when form is invalid', () => {
      component.emailBuyerForm.setValue({ email: '' });
      component.emailBuyerForm.markAsTouched();
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('.btn--primary'));
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should enable Agendar button when form is valid', () => {
      component.emailBuyerForm.setValue({ email: 'test@example.com' });
      component.emailBuyerForm.markAsTouched();
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('.btn--primary'));
      expect(button.nativeElement.disabled).toBe(false);
    });
  });

  describe('VisitsModal Integration', () => {
    it('should pass correct inputs to modal', () => {
      fixture.detectChanges();
      
      const modal = fixture.debugElement.query(By.directive(VisitsModalComponent));
      expect(modal.componentInstance.isOpen).toBe(false);
      expect(modal.componentInstance.idHouse).toBe(mockHouse.id);
      expect(modal.componentInstance.columnAction).toBe(component.columnAction);
    });

    it('should close modal when receiving close event', () => {
      component.modalIsOpen = true;
      fixture.detectChanges();
      
      const modal = fixture.debugElement.query(By.directive(VisitsModalComponent));
      modal.componentInstance.close.emit();
      fixture.detectChanges();
      
      expect(component.modalIsOpen).toBe(false);
    });

    it('should call newVisit when receiving newVisit event', () => {
      const newVisitSpy = jest.spyOn(component, 'newVisit');
      fixture.detectChanges();
      
      const modal = fixture.debugElement.query(By.directive(VisitsModalComponent));
      modal.componentInstance.newVisit.emit(123);
      
      expect(newVisitSpy).toHaveBeenCalledWith(123);
    });
  });
});