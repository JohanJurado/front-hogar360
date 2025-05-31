import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './components/pages/category-page/category-page.component';
import { AdminLayoutComponent } from './components/templates/admin-layout/admin-layout.component';
import { LocationPageComponent } from './components/pages/location-page/location-page.component';
import { DashboardPageComponent } from './components/pages/dashboard-page/dashboard-page.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { SellerLayoutComponent } from './components/templates/seller-layout/seller-layout.component';
import { HousePageComponent } from './components/pages/house-page/house-page.component';
import { HomeComponent } from './components/templates/home/home.component';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginPageComponent },
    ]
  },
  { path: 'admin', component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'categories', component: CategoryPageComponent },
      { path: 'locations', component: LocationPageComponent },
      { path: 'users', component: UserPageComponent },
    ]
  },
  { path: 'seller', component: SellerLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['SELLER'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'houses', component: HousePageComponent },
      { path: 'schedulers', component: LocationPageComponent }, 
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
