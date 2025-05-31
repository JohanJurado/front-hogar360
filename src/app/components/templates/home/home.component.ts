import { Component, inject } from '@angular/core';
import { TokenService } from '@app/core/services/api/auth/token.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  tokenService = inject(TokenService);
  isTokenActive = !this.tokenService.isTokenExpired();
}
