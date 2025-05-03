import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-link',
  templateUrl: './sidebar-link.component.html',
  styleUrls: ['./sidebar-link.component.scss']
})
export class SidebarLinkComponent {
  @Input() path: string = '';      
  @Input() icon: string = '';       
  @Input() label: string = '';      

  constructor(private router: Router) {}

  isActive(): boolean {
    return this.router.isActive(this.path, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}

