import { Dashboard } from './pages/dashboard/dashboard';
import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { AuthGuard } from './guards/auth.guard';
import { TwoFactorSetup } from './auth/twofa-setup/twofa-setup';
import { TwoFactorVerify } from './auth/twofa-verify/twofa-verify';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'pages/dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: '2fa/setup', component: TwoFactorSetup },
  { path: '2fa/verify', component: TwoFactorVerify },
];
