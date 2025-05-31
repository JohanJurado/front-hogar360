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
  @Input() activeSession: boolean = true;
  @Input() home_template: boolean = false;

  modalOptionsProfile: boolean = false;

  constructor(
    public router: Router,
    public tokenService: TokenService,
    public notificationService: NotificationService
  ) {}

  redirectDashboard(){
    let pathRole = this.tokenService.getRole()?.toLowerCase();
    this.router.navigate(['/' + pathRole + '/dashboard'])
  }

  logout(){
    this.tokenService.removeToken();
    this.activeSession = false;
    this.notificationService.success('Sesión finalizada exitosamente');
    this.router.navigate([''])
  }

  changeModalProfileOptions(){
    this.modalOptionsProfile = !this.modalOptionsProfile;
  }
}
