import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@app/core/services/api/auth/token.service';
import { NotificationService } from '@app/core/services/notification/notification.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent {
  @Input() profile!: string;
  @Input() layout: boolean = true;

  modalOptionsProfile: boolean = false;

  constructor(
    public router: Router,
    public tokenService: TokenService,
    public notificationService: NotificationService
  ) {}

  logout(){
    this.tokenService.removeToken();
    this.notificationService.success('Sesión finalizada exitosamente');
    this.router.navigate([''])
  }

  changeModalProfileOptions(){
    this.modalOptionsProfile = !this.modalOptionsProfile;
  }
}
