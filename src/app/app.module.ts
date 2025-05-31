import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoleculesModule } from './components/molecules/molecules.module';
import { OrganismsModule } from './components/organisms/organisms.module';
import { AtomsModule } from './components/atoms/atoms.module';
import { PagesModule } from './components/pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      preventDuplicates: true,
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AtomsModule,
    MoleculesModule,
    OrganismsModule,
    PagesModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('authToken'),
        allowedDomains: ['localhost:8081', 'localhost:8085'],
        disallowedRoutes: ['http://localhost:8085/api/auth/login']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
