import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismsModule } from '../organisms/organisms.module';
import { CategoryPageComponent } from './category-page/category-page.component';
import { LocationPageComponent } from './location-page/location-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPageComponent } from './user-page/user-page.component';
import { HousePageComponent } from './house-page/house-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SchedulerPageComponent } from './scheduler-page/scheduler-page.component';
import { HouseDetailsPageComponent } from './house-details-page/house-details-page.component';



@NgModule({
  declarations: [
    CategoryPageComponent,
    LocationPageComponent,
    DashboardPageComponent,
    UserPageComponent,
    HousePageComponent,
    LandingPageComponent,
    LoginPageComponent,
    SchedulerPageComponent,
    HouseDetailsPageComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    OrganismsModule,
    ReactiveFormsModule
  ],
  exports: [
    CategoryPageComponent,
    DashboardPageComponent,
    LocationPageComponent,
    UserPageComponent,
    SchedulerPageComponent,
    HouseDetailsPageComponent
  ]
})
export class PagesModule { }
