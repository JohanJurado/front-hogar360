import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { SidebarLinkComponent } from '../../molecules/sidebar-link/sidebar-link.component';
import { By } from '@angular/platform-browser';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const mockLinks = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/categories', icon: 'categories', label: 'Categories' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent, SidebarLinkComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.links = mockLinks;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of links', () => {
    const linkElements = fixture.debugElement.queryAll(By.css('app-sidebar-link'));
    expect(linkElements.length).toBe(mockLinks.length);
  });

  it('should pass correct inputs to link components', () => {
    const linkComponents = fixture.debugElement.queryAll(By.directive(SidebarLinkComponent));
    
    linkComponents.forEach((linkDebugElement, index) => {
      const linkComponent = linkDebugElement.componentInstance as SidebarLinkComponent;
      expect(linkComponent.path).toBe(mockLinks[index].path);
      expect(linkComponent.icon).toBe(mockLinks[index].icon);
      expect(linkComponent.label).toBe(mockLinks[index].label);
    });
  });

  it('should display empty state when no links', () => {
    component.links = [];
    fixture.detectChanges();

    const linkElements = fixture.debugElement.queryAll(By.css('app-sidebar-link'));
    expect(linkElements.length).toBe(0);
  });
});