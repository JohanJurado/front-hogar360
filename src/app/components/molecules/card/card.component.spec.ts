import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { House } from '@app/core/models/house';
import { CurrencyPipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let debugElement: DebugElement;

  const mockHouse: House = {
    id: 1,
    name: 'Casa Moderna',
    description: 'Casa Moderna',
    neighborhood: 'Poblado',
    cityName: 'Medellín',
    departmentName: 'Antioquia',
    categoryName: 'Antioquia',
    price: 250000,
    bedroomCount: 3,
    bathroomCount: 2,
    // ... otras propiedades necesarias
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
      providers: [CurrencyPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.house = mockHouse;
    component.index = 0;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input binding', () => {
    it('should receive and display house data', () => {
      expect(component.house).toEqual(mockHouse);
    });

    it('should receive index input', () => {
      expect(component.index).toBe(0);
    });

    // it('should handle undefined house input', () => {
    //   component.house = undefined as any;
    //   fixture.detectChanges();
      
    //   const cardElement = debugElement.query(By.css('.card'));
    //   expect(cardElement).toBeTruthy(); // Verifica que no rompa el render
    // });
  });

  describe('Image logic', () => {
    it('should generate correct image path based on index', () => {
      expect(component.getHouseImage(0)).toBe('./assets/img/card-house-icons/house-card-img-1.png');
      expect(component.getHouseImage(1)).toBe('./assets/img/card-house-icons/house-card-img-2.png');
      expect(component.getHouseImage(2)).toBe('./assets/img/card-house-icons/house-card-img-3.png');
      expect(component.getHouseImage(3)).toBe('./assets/img/card-house-icons/house-card-img-1.png'); // Verifica el ciclo
    });

    it('should display correct image in template', () => {
      const imgElement = debugElement.query(By.css('.card__img'));
      expect(imgElement.nativeElement.src).toContain('house-card-img-1.png');
    });
  });

  describe('Template rendering', () => {
    it('should display house name', () => {
      const nameElement = debugElement.query(By.css('.card__info__name'));
      expect(nameElement.nativeElement.textContent).toContain(mockHouse.name);
    });

    it('should display formatted location', () => {
      const locationElement = debugElement.query(By.css('.card__info__location'));
      const expectedText = `BARRIO ${mockHouse.neighborhood}, ${mockHouse.cityName} - ${mockHouse.departmentName}`;
      expect(locationElement.nativeElement.textContent.trim()).toBe(expectedText);
    });

    it('should display formatted price', () => {
      const currencyPipe = TestBed.inject(CurrencyPipe);
      const expectedPrice = currencyPipe.transform(mockHouse.price, 'USD');
      
      const priceElement = debugElement.query(By.css('.card__info__price p'));
      expect(priceElement.nativeElement.textContent.trim()).toContain(expectedPrice);
    });

    it('should display bedroom and bathroom counts', () => {
      const bedroomElement = debugElement.query(By.css('.card__info__details div:nth-child(1) p'));
      const bathroomElement = debugElement.query(By.css('.card__info__details div:nth-child(2) p'));
      
      expect(bedroomElement.nativeElement.textContent.trim()).toBe(mockHouse.bedroomCount.toString());
      expect(bathroomElement.nativeElement.textContent.trim()).toBe(mockHouse.bathroomCount.toString());
    });

    it('should display area unit', () => {
      const areaElement = debugElement.query(By.css('.card__info__details div:nth-child(3) p'));
      expect(areaElement.nativeElement.textContent.trim()).toBe('sq ft');
    });
  });

  describe('Image rendering', () => {
    it('should render all expected icons', () => {
      const icons = debugElement.queryAll(By.css('img'));
      expect(icons.length).toBe(5); // 1 casa + corazón + 3 iconos de detalles
      
      const heartIcon = debugElement.query(By.css('img[alt="icon-heart-icon"]'));
      expect(heartIcon).toBeTruthy();
      
      const bedroomIcon = debugElement.query(By.css('img[alt="bedroom-icon"]'));
      expect(bedroomIcon).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt texts for images', () => {
      const mainImage = debugElement.query(By.css('.card__img'));
      expect(mainImage.nativeElement.alt).toBe('house-img');
      
      const icons = debugElement.queryAll(By.css('img'));
      icons.forEach(icon => {
        expect(icon.nativeElement.alt).toBeTruthy();
      });
    });
  });
});