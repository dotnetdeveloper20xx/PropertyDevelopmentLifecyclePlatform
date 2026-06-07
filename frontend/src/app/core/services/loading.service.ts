import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Global loading state service.
 * Tracks multiple concurrent loading operations via reference counting.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  start(): void {
    this.loadingCount++;
    this.loadingSubject.next(true);
  }

  stop(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
