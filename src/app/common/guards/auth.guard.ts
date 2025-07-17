import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    toaster.show('Please sign in to access this page', 'warning');
    router.navigate(['/signin']);
    return false;
  }
};