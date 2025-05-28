import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AccessDeniedComponent} from "./access-denied/access-denied.component";
import {AuthGuard} from "./auth/auth.guard";
import {UserInfoComponent} from "./user-info/user-info.component";
import {ProfileComponent} from "./profile/profile.component";
import {SendTipComponent} from "./send-tip/send-tip.component";
import { TipsComponent } from "./tips/tips.component";
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    canActivate: [AuthGuard],
    // The user need to have these roles to access page
    data: { roles: ['user'] }
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'send-tip',
    component: SendTipComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tip/:link',
    component: SendTipComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tips',
    component: TipsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
