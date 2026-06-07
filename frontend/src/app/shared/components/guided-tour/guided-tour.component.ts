import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GuidedTourService, TourStep } from '../../../core/services/guided-tour.service';
import { Subscription } from 'rxjs';

/**
 * Guided tour overlay component. Renders step-by-step walkthrough hints.
 * Place once in the main layout. Controlled via GuidedTourService.
 *
 * Each step shows a spotlight-style tooltip with title, content, and navigation.
 * Supports element highlighting via CSS selectors.
 */
@Component({
  selector: 'app-guided-tour',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isActive()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 z-[9998]" (click)="dismiss()"></div>

      <!-- Tour Step Card -->
      <div class="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <div class="card bg-base-100 shadow-2xl border border-primary/30">
          <div class="card-body">
            <!-- Progress -->
            <div class="flex items-center justify-between mb-2">
              <span class="badge badge-primary badge-sm">Step {{ currentIndex() + 1 }} of {{ totalSteps() }}</span>
              <button class="btn btn-ghost btn-xs" (click)="dismiss()" aria-label="Close tour">✕</button>
            </div>

            <!-- Progress bar -->
            <progress
              class="progress progress-primary w-full h-1 mb-4"
              [value]="currentIndex() + 1"
              [max]="totalSteps()"
            ></progress>

            <!-- Content -->
            <h3 class="text-lg font-bold text-base-content">{{ currentStep()?.title }}</h3>
            <p class="text-sm text-base-content/70 mt-2 leading-relaxed">{{ currentStep()?.content }}</p>

            @if (currentStep()?.tip) {
              <div class="bg-info/10 border border-info/20 rounded-lg p-3 mt-3">
                <p class="text-xs text-info font-medium">💡 {{ currentStep()?.tip }}</p>
              </div>
            }

            <!-- Navigation -->
            <div class="card-actions justify-between mt-6">
              <button
                class="btn btn-ghost btn-sm"
                [disabled]="currentIndex() === 0"
                (click)="prev()"
              >← Previous</button>

              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm" (click)="dismiss()">Skip Tour</button>
                @if (currentIndex() < totalSteps() - 1) {
                  <button class="btn btn-primary btn-sm" (click)="next()">Next →</button>
                } @else {
                  <button class="btn btn-primary btn-sm" (click)="complete()">🎉 Get Started</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class GuidedTourComponent implements OnInit, OnDestroy {
  isActive = signal(false);
  currentStep = signal<TourStep | null>(null);
  currentIndex = signal(0);
  totalSteps = signal(0);

  private subscription?: Subscription;

  constructor(
    private tourService: GuidedTourService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.tourService.tourState$.subscribe(state => {
      this.isActive.set(state.active);
      this.currentStep.set(state.currentStep);
      this.currentIndex.set(state.currentIndex);
      this.totalSteps.set(state.totalSteps);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  next(): void {
    const step = this.tourService.next();
    if (step?.route) {
      this.router.navigate([step.route]);
    }
  }

  prev(): void {
    const step = this.tourService.prev();
    if (step?.route) {
      this.router.navigate([step.route]);
    }
  }

  dismiss(): void {
    this.tourService.stop();
  }

  complete(): void {
    this.tourService.complete();
    this.router.navigate(['/dashboard']);
  }
}
