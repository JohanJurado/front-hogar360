import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent {
    links = [
      {
        path: '/dashboard', 
        icon: 'category-icon',
        label: 'Dashboard'
      },
      {
        path: '/categories', 
        icon: 'category-icon',
        label: 'Categorias'
      },
      {
        path: '/locations', 
        icon: 'category-icon',
        label: 'Ubicaciones'
      },
      {
        path: '/configuration', 
        icon: 'category-icon',
        label: 'Configuracion'
      }
    ]
}
