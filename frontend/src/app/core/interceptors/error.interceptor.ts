import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { LoggingService } from '../services/logging.service';

/**
 * Global HTTP error interceptor.
 * Handles 401 (redirect to login), 403 (access denied toast), 500 (generic error toast).
 * All errors are logged via LoggingService.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const loggingService = inject(LoggingService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't handle errors for auth endpoints (login handles its own)
      if (req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 401:
          loggingService.warn('Unauthorized request — redirecting to login');
          authService.logout();
          router.navigate(['/login']);
          break;

        case 403:
          toastService.error('You do not have permission to perform this action.');
          break;

        case 404:
          // Let individual components handle 404s
          break;

        case 0:
          toastService.error('Network error. Please check your connection.');
          loggingService.error('Network error', error);
          break;

        default:
          if (error.status >= 500) {
            toastService.error('An unexpected error occurred. Please try again.');
            loggingService.error(`Server error ${error.status}`, error);
          }
          break;
      }

      return throwError(() => error);
    })
  );
};
