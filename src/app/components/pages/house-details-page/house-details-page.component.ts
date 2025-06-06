import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableColumn } from '@app/core/models/dtos/tableColumn';
import { House } from '@app/core/models/house';
import { Visit } from '@app/core/models/visit';
import { VisitService } from '@app/core/services/api/visit/visit.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { TABLE_COLUMNS } from '@app/shared/constants/table-columns';

@Component({
  selector: 'app-house-details-page',
  templateUrl: './house-details-page.component.html',
  styleUrls: ['./house-details-page.component.scss']
})
export class HouseDetailsPageComponent {
  imgId: number = 0;
  house: House | null = null;
  columnAction = TABLE_COLUMNS.VISIT_ACTION as TableColumn[];
  public emailBuyerForm: FormGroup;

  modalIsOpen = false;

  closeModal(){
    this.modalIsOpen = false;
  }

  openModal(){
    this.modalIsOpen = true;
  }
  
  constructor(
    public router: Router,
    private readonly fb: FormBuilder,
    private readonly visitService: VisitService,
    private readonly notificationService: NotificationService,
    private readonly translatorService: TranslatorService
  ) {
    const routerHouse = this.router.getCurrentNavigation()?.extras.state?.['house'];
    const routerImgHouse = this.router.getCurrentNavigation()?.extras.state?.['imgId'];

    if (routerHouse != null){
      this.house = routerHouse;
      this.imgId = routerImgHouse;
      localStorage.setItem('houseDetails', JSON.stringify(this.house));
      localStorage.setItem('houseImgDetails', this.imgId.toString());
    } else {
      this.house = JSON.parse(localStorage.getItem('houseDetails')!) as House;
      this.imgId = Number(localStorage.getItem('houseImgDetails')!);  
    }

    this.emailBuyerForm = this.fb.group ({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl(): FormControl {
    return this.emailBuyerForm.get('email') as FormControl;
  }

  getHouseImage(index: number): string {
    return `./assets/img/card-house-icons/house-card-img-${(index % 3) + 1}.png`;
  }

  newVisit(idScheduler: number){
    const visitData = {
      emailBuyer: this.emailControl.value,
      idScheduler: idScheduler
    }

    this.visitService.createVisit(visitData as Visit).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.emailBuyerForm.reset();
        this.closeModal();
      },
      error: (error) => {
        const message = error?.error?.message ?? FORM_MESSAGES.ERROR;
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }
}