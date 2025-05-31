import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLinkComponent } from './sidebar-link/sidebar-link.component';
import { RouterModule } from '@angular/router';
import { SelectComponent } from './select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { PaginationComponent } from './pagination/pagination.component';
import { CardComponent } from './card/card.component';



@NgModule({
  declarations: [
    SidebarLinkComponent,
    SelectComponent,
    PaginationComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    SidebarLinkComponent,
    SelectComponent,
    PaginationComponent,
    CardComponent
  ]
})
export class MoleculesModule { }
