import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.currentToken;

  // Skip adding token for auth endpoints
  const isAuthEndpoint = req.url.includes('/auth/');

  if (token && !isAuthEndpoint) {
    const authReq = req.clone({
      setHeaders: {
        token: token,
      },
    });
    return next(authReq);
  }

  return next(req);
};
