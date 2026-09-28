import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from './authentication';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(Authentication);

  const isAuthAPI = req.url.includes('/login') || req.url.includes('/register');

  if (authenticationService.loggedIn() && !isAuthAPI) {
    const token = authenticationService.getToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};