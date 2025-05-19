import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLinkComponent } from './sidebar-link/sidebar-link.component';
import { RouterModule } from '@angular/router';
import { SelectComponent } from './select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '@app/shared/directives/click-outside.directive';
import { SharedModule } from '@app/shared/shared.module';



@NgModule({
  declarations: [
    SidebarLinkComponent,
    SelectComponent
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
    SelectComponent
  ]
})
export class MoleculesModule { }
