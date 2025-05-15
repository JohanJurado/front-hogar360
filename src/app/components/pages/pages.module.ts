import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismsModule } from '../organisms/organisms.module';
import { CategoryPageComponent } from './category-page/category-page.component';
import { LocationPageComponent } from './location-page/location-page.component';



@NgModule({
  declarations: [
    CategoryPageComponent,
    LocationPageComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    OrganismsModule
  ],
  exports: [
    CategoryPageComponent
  ]
})
export class PagesModule { }
