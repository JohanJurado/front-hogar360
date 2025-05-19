import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

// Componente de prueba para alojar la directiva
@Component({
  template: `
    <div class="container" (clickOutside)="onClickOutside()">
      <button class="inside-button">Inside</button>
    </div>
    <button class="outside-button">Outside</button>
  `
})
class TestComponent {
  clicksOutside = 0;
  onClickOutside() {
    this.clicksOutside++;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let containerEl: DebugElement;
  let insideButtonEl: DebugElement;
  let outsideButtonEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ClickOutsideDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    
    // Obtener elementos del DOM
    containerEl = fixture.debugElement.query(By.css('.container'));
    insideButtonEl = fixture.debugElement.query(By.css('.inside-button'));
    outsideButtonEl = fixture.debugElement.query(By.css('.outside-button'));
    
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new ClickOutsideDirective(containerEl);
    expect(directive).toBeTruthy();
  });

  it('should emit event when clicking outside', () => {
    // Click fuera del contenedor
    outsideButtonEl.nativeElement.click();
    expect(component.clicksOutside).toBe(1);
    
    // Segundo click fuera
    document.body.click();
    expect(component.clicksOutside).toBe(2);
  });

  it('should not emit event when clicking inside', () => {
    // Click dentro del contenedor
    containerEl.nativeElement.click();
    expect(component.clicksOutside).toBe(0);
    
    // Click en un elemento hijo
    insideButtonEl.nativeElement.click();
    expect(component.clicksOutside).toBe(0);
  });

  it('should handle multiple clicks correctly', () => {
    outsideButtonEl.nativeElement.click();
    outsideButtonEl.nativeElement.click();
    insideButtonEl.nativeElement.click();
    outsideButtonEl.nativeElement.click();
    
    expect(component.clicksOutside).toBe(3);
  });

  it('should work with dynamic elements', () => {
    // Simular elemento dinámico fuera
    const dynamicElement = document.createElement('div');
    document.body.appendChild(dynamicElement);
    
    dynamicElement.click();
    expect(component.clicksOutside).toBe(1);
    
    document.body.removeChild(dynamicElement);
  });
});