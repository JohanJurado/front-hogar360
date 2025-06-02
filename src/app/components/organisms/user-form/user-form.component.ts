import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/core/models/user';
import { UserService } from '@app/core/services/api/user/user.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { TranslatorService } from '@app/core/services/translator/translator.service';
import { FORM_MESSAGES } from '@app/shared/constants/form-messages';
import { MAX_LENGTH_FILEDS } from '@app/shared/constants/max-length-fileds';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {

  public userForm: FormGroup;
  
  maxLengthPhoneNumber = MAX_LENGTH_FILEDS.USER.PHONE_NUMBER;

  constructor(
    private readonly fb: FormBuilder, 
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly translatorService: TranslatorService
  ){ 
    this.userForm = this.fb.group ({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      document: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(this.maxLengthPhoneNumber), this.phoneNumberValidator]],
      birthdate: [null, [Validators.required, this.adultValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]]
      });
    }

  passwordMatchValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return this.userForm?.get('password')?.value === control.value 
      ? null 
      : { invalidPassword: true };
  }

  phoneNumberValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const validFormat = /^\+?\d+$/.test(control.value);
    return validFormat ? null : { invalidPhoneNumber: true };
  }

  adultValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18 ? null : { underAge: true };
  }

  get nameControl(): FormControl {
    return this.userForm.get('name') as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.userForm.get('lastName') as FormControl;
  }

  get documentControl(): FormControl {
    return this.userForm.get('document') as FormControl;
  }

  get phoneNumberControl(): FormControl {
    return this.userForm.get('phoneNumber') as FormControl;
  }

  get birthdateControl(): FormControl {
    return this.userForm.get('birthdate') as FormControl;
  }

  get emailControl(): FormControl {
    return this.userForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.userForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.userForm.get('confirmPassword') as FormControl;
  }

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService.createSeller(this.userForm.value as User).subscribe({
      next: (response) => {
        this.notificationService.success(this.translatorService.translate(response.message));
        this.userForm.reset();
      },
      error: (error) => {
        const message = error?.error?.message ?? FORM_MESSAGES.ERROR;
        this.notificationService.error(this.translatorService.translate(message));
      }
    });
  }
}
