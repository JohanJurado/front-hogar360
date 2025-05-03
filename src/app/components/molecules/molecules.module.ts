import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLinkComponent } from './sidebar-link/sidebar-link.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SidebarLinkComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SidebarLinkComponent
  ]
})
export class MoleculesModule { }
