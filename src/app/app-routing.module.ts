import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './components/pages/category-page/category-page.component';
import { AdminLayoutComponent } from './components/templates/admin-layout/admin-layout.component';
import { LocationPageComponent } from './components/pages/location-page/location-page.component';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent,
    children: [
    { path: 'dashboard', component: CategoryPageComponent },
    { path: 'categories', component: CategoryPageComponent },
    { path: 'locations', component: LocationPageComponent },
    { path: '', redirectTo: '/categories', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
