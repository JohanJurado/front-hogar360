import { Component } from '@angular/core';
import { SIDEBAR_ITEMS } from '@app/shared/constants/sidebar-items';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  links = SIDEBAR_ITEMS['ADMIN']
}
