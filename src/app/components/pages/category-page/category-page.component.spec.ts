import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryPageComponent } from './category-page.component';
import { CategoryFormComponent } from '@app/components/organisms/category-form/category-form.component';
import { InputComponent } from '@app/components/atoms/input/input.component'; // Añade esto
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        CategoryPageComponent,
        CategoryFormComponent,
        InputComponent
      ],
      providers: [
        { 
          provide: CategoryService, 
          useValue: { createCategory: jest.fn() }
        },
        { 
          provide: NotificationService, 
          useValue: { success: jest.fn(), error: jest.fn() }
        },
        { 
          provide: TranslatorService, 
          useValue: { translate: jest.fn(text => text) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the category form', () => {
    const form = fixture.debugElement.query(By.directive(CategoryFormComponent));
    expect(form).toBeTruthy();
  });

  it('should display the correct title', () => {
    const title = fixture.debugElement.query(By.css('.content__title'));
    expect(title.nativeElement.textContent).toContain('Crear Categoría');
  });
});