import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login'
import { RegisterComponent } from './auth/register/register';
import { ProfileComponent } from './auth/profile/profile';
import {HomeComponent} from './home/home';
import {DashboardComponent} from './features/dashboard/dashboard';
import { ProfilePageComponent } from './features/profile-page/profile-page'; // ✅ Import

import {authGuard} from './core/guards/auth-guard';
export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/profile', component: ProfileComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },

];
