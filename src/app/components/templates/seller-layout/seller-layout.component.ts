import { Component } from '@angular/core';
import { SIDEBAR_ITEMS } from '@app/shared/constants/sidebar-items';


@Component({
  selector: 'app-seller-layout',
  templateUrl: './seller-layout.component.html',
  styleUrls: ['./seller-layout.component.scss']
})
export class SellerLayoutComponent {
  links = SIDEBAR_ITEMS['SELLER']
  profile = 'Vendedor';
}
