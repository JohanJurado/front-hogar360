import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    SidebarAdminComponent,
    TopNavbarComponent,
    CategoryFormComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SidebarAdminComponent,
    TopNavbarComponent,
    CategoryFormComponent,
    FooterComponent
  ]
})
export class OrganismsModule { }
