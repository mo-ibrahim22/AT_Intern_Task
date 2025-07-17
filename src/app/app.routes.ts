import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/auth/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
];
