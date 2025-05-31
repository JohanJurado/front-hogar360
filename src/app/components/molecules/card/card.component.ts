import { Component, Input } from '@angular/core';
import { House } from '@app/core/models/house';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'] 
})
export class CardComponent {
  @Input() house!: House;
  @Input() index!: number;

  getHouseImage(index: number): string {
    return `./assets/img/card-house-icons/house-card-img-${(index % 3) + 1}.png`;
  }
}
