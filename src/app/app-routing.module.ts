import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './components/pages/category-page/category-page.component';
import { AdminLayoutComponent } from './components/templates/admin-layout/admin-layout.component';
import { LocationPageComponent } from './components/pages/location-page/location-page.component';
import { DashboardPageComponent } from './components/pages/dashboard-page/dashboard-page.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent,
    children: [
    { path: 'dashboard', component: DashboardPageComponent },
    { path: 'categories', component: CategoryPageComponent },
    { path: 'locations', component: LocationPageComponent },
    { path: 'users', component: UserPageComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
