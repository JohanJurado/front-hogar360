import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './components/pages/category-page/category-page.component';
import { AdminLayoutComponent } from './components/templates/admin-layout/admin-layout.component';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent,
    children: [
    { path: 'categories', component: CategoryPageComponent },
    { path: '', redirectTo: '/categories', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
