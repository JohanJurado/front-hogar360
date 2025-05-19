import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { FooterComponent } from './footer/footer.component';
import { TableComponent } from './table/table.component';
import { LocationFormComponent } from './location-form/location-form.component';


@NgModule({
  declarations: [
    SidebarComponent,
    TopNavbarComponent,
    CategoryFormComponent,
    FooterComponent,
    TableComponent,
    LocationFormComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SidebarComponent,
    TopNavbarComponent,
    CategoryFormComponent,
    FooterComponent,
    TableComponent,
    LocationFormComponent
  ]
})
export class OrganismsModule { }
