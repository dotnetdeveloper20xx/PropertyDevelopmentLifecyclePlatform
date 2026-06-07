import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Frontend logging service. Centralizes all logging with level control.
 * In production, could be extended to send errors to a backend endpoint.
 */
@Injectable({ providedIn: 'root' })
export class LoggingService {
  debug(message: string, ...data: unknown[]): void {
    if (!environment.production) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  }

  info(message: string, ...data: unknown[]): void {
    if (!environment.production) {
      console.info(`[INFO] ${message}`, ...data);
    }
  }

  warn(message: string, ...data: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...data);
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error);

    // In production, send to error reporting service
    if (environment.production) {
      this.reportError(message, error);
    }
  }

  private reportError(message: string, error?: unknown): void {
    // TODO: Integrate with Sentry, Application Insights, or custom endpoint
    // For now, just log. This is the single place to add error reporting.
  }
}
