import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismsModule } from '../organisms/organisms.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { SellerLayoutComponent } from './seller-layout/seller-layout.component';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    SellerLayoutComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    AtomsModule,
    MoleculesModule,
    OrganismsModule
  ]
})
export class TemplatesModule { }
