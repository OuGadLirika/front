import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { SendTipComponent } from './send-tip/send-tip.component';
import { TipsComponent } from './tips/tips.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { AuthGuard } from './auth/auth.guard';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { initializer } from '../utils/app-init';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    AccessDeniedComponent,
    UserInfoComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SendTipComponent,
    TipsComponent
  ],
  providers: [
    AuthGuard,
    KeycloakService,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
