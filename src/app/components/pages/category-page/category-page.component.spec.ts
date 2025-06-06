import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CategoryPageComponent } from './category-page.component';
import { CategoryFormComponent } from '@app/components/organisms/category-form/category-form.component';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { TableComponent } from '@app/components/organisms/table/table.component'; // Añadir esto
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '@app/core/services/api/category/category.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { of } from 'rxjs';
import { Category } from '@app/core/models/category';
import { Pagination } from '@app/core/models/pagination';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockCategories = [
    { id: 1, name: 'Casa', description: 'Propiedad residencial' },
    { id: 2, name: 'Apartamento', description: 'Propiedad urbana' }
  ];

  const mockResponse = {
    content: mockCategories,
    totalElements: 10,
    page: 0,
    size: 2
  };

  beforeEach(async () => {
    const categoryServiceMock = {
      getCategories: jest.fn().mockReturnValue(of(mockResponse)),
      createCategory: jest.fn()
    };

    const notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        CategoryPageComponent,
        CategoryFormComponent,
        InputComponent,
        TableComponent
      ],
      providers: [
        { 
          provide: CategoryService, 
          useValue: categoryServiceMock 
        },
        { 
          provide: NotificationService, 
          useValue: notificationServiceMock 
        },
        { 
          provide: TranslatorService, 
          useValue: { translate: jest.fn(text => text) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic rendering', () => {
  it('should render the category form', () => {
    const form = fixture.debugElement.query(By.directive(CategoryFormComponent));
    expect(form).toBeTruthy();
  });

  it('should render the table component', () => {
    const table = fixture.debugElement.query(By.directive(TableComponent));
    expect(table).toBeTruthy();
  });

  it('should display the correct titles', () => {
    const titles = fixture.debugElement.queryAll(By.css('.content__title'));
    expect(titles[0].nativeElement.textContent).toContain('Crear categoría');
    expect(titles[1].nativeElement.textContent).toContain('Categorias existentes');
  });
});

describe('Initialization', () => {
  it('should initialize with default values', () => {
    expect(component.page).toBe(0);
    expect(component.size).toBe(10);
    expect(component.totalItems).toBe(10);
    expect(component.columns.length).toBe(3);
  });

  it('should call getCategories on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalledWith(0, 10, true);
  });
});

describe('Pagination', () => {
  it('should update page and call getCategories on pageChange', fakeAsync(() => {
    const newPage = 2;
    component.onPageChange(newPage);
    tick();
    
    expect(component.page).toBe(newPage);
    expect(categoryService.getCategories).toHaveBeenCalledWith(newPage, component.size);
  }));

  it('should pass correct pagination inputs to table', () => {
    const table = fixture.debugElement.query(By.directive(TableComponent));
    
    expect(table.componentInstance.currentPage).toBe(component.page);
    expect(table.componentInstance.itemsPerPage).toBe(component.size);
    expect(table.componentInstance.totalItems).toBe(component.totalItems);
  });
});

describe('Table columns', () => {

  it('should pass columns to table component', () => {
    const table = fixture.debugElement.query(By.directive(TableComponent));
    expect(table.componentInstance.columns).toBe(component.columns);
  });
});

describe('Integration with TableComponent', () => {
  it('should update currentPage when table emits pageChange', () => {
    const table = fixture.debugElement.query(By.directive(TableComponent));
    const newPage = 2;
    
    table.componentInstance.pageChange.emit(newPage);
    fixture.detectChanges();
    
    expect(component.page).toBe(newPage);
  });

  it('should call getCategories with correct parameters after page change', fakeAsync(() => {
    const newPage = 3;
    component.onPageChange(newPage);
    tick();
    
    expect(categoryService.getCategories).toHaveBeenCalledWith(newPage, component.size);
  }));
});

describe('reloadCategoryList', () => {
  it('should call onPageChange with current page', fakeAsync(() => {
    const onPageChangeSpy = jest.spyOn(component, 'onPageChange');
    
    component.page = 2;
    
    component.reloadCategoryList();
    tick();
    
    expect(onPageChangeSpy).toHaveBeenCalledWith(2);
    expect(categoryService.getCategories).toHaveBeenCalledWith(2, component.size);
  }));

  it('should refresh categories list', fakeAsync(() => {
    const newMockResponse = {
      content: [{ id: 3, name: 'Nueva Categoría', description: 'Descripción nueva' }],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      last: true
    };
    categoryService.getCategories.mockReturnValueOnce(of(newMockResponse as Pagination<Category>));
    
    component.reloadCategoryList();
    tick();
    
    component.categories$.subscribe(categories => {
      expect(categories).toEqual(newMockResponse.content);
      expect(component.totalItems).toBe(newMockResponse.totalElements);
    });
  }));
});
});