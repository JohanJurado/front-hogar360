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



@NgModule({
  declarations: [
    CategoryPageComponent,
    LocationPageComponent,
    DashboardPageComponent,
    UserPageComponent
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
  ]
})
export class PagesModule { }
