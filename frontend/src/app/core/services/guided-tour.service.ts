import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TourStep {
  title: string;
  content: string;
  tip?: string;
  route?: string;
  elementSelector?: string;
}

export interface TourState {
  active: boolean;
  currentStep: TourStep | null;
  currentIndex: number;
  totalSteps: number;
}

const TOUR_COMPLETED_KEY = 'buildEstate_tourCompleted';

/**
 * Guided tour service. Manages multi-step onboarding walkthrough.
 * Tracks completion in localStorage so the tour doesn't repeat.
 */
@Injectable({ providedIn: 'root' })
export class GuidedTourService {
  private steps: TourStep[] = [];
  private currentIndex = 0;

  private stateSubject = new BehaviorSubject<TourState>({
    active: false,
    currentStep: null,
    currentIndex: 0,
    totalSteps: 0
  });

  tourState$ = this.stateSubject.asObservable();

  /** Default onboarding tour for new users */
  private readonly onboardingSteps: TourStep[] = [
    {
      title: 'Welcome to BuildEstate Pro',
      content: 'This platform helps you manage real estate development projects from land acquisition through to completion. Let\'s take a quick tour of the key areas.',
      tip: 'This tour takes about 2 minutes. You can skip at any time.',
      route: '/dashboard'
    },
    {
      title: 'Your Dashboard',
      content: 'The dashboard gives you a real-time overview of your land acquisition pipeline. You\'ll see key metrics, pipeline status counts, and items needing attention.',
      tip: 'The "Attention Needed" section highlights opportunities that may be stuck or need follow-up.',
      route: '/dashboard',
      elementSelector: '.stats-grid'
    },
    {
      title: 'Sidebar Navigation',
      content: 'The sidebar on the left is your main navigation. It\'s grouped by module. As more modules go live, new sections will appear here.',
      tip: 'On mobile, tap the menu icon in the top-left to open the sidebar.',
      elementSelector: '.drawer-side'
    },
    {
      title: 'Land Opportunities',
      content: 'This is where you manage your pipeline of potential development sites. Each opportunity moves through stages: Identified → Due Diligence → Offer → Acquired.',
      tip: 'Click any row in the table to see full details, add due diligence checks, or record offers.',
      route: '/opportunities'
    },
    {
      title: 'Creating Opportunities',
      content: 'To add a new land opportunity, click "Create Land Opportunity". You only need a name, location, and land size to get started.',
      tip: 'You can always come back and add more details later — financial info, agents, and notes are all optional.',
      route: '/opportunities/new'
    },
    {
      title: 'Help Centre',
      content: 'The Help Centre contains guides, FAQs, a glossary, and documentation for every feature. Use the search bar to find answers quickly.',
      tip: 'Every page also has a "Learn more →" link that takes you to the relevant help article.',
      route: '/help'
    },
    {
      title: 'You\'re All Set!',
      content: 'You now know the basics. Start by creating your first land opportunity, or explore the Help Centre for detailed guides. The platform is designed to guide you at every step.',
      tip: 'You can restart this tour anytime from the Help Centre.'
    }
  ];

  /** Check if user has completed the tour before */
  get isTourCompleted(): boolean {
    return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
  }

  /** Start the onboarding tour */
  startOnboarding(): void {
    this.start(this.onboardingSteps);
  }

  /** Start a custom tour */
  start(steps: TourStep[]): void {
    this.steps = steps;
    this.currentIndex = 0;
    this.emitState(true);
  }

  next(): TourStep | null {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.emitState(true);
      return this.steps[this.currentIndex];
    }
    return null;
  }

  prev(): TourStep | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emitState(true);
      return this.steps[this.currentIndex];
    }
    return null;
  }

  stop(): void {
    this.emitState(false);
  }

  complete(): void {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    this.emitState(false);
  }

  /** Reset tour so it can be shown again */
  reset(): void {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
  }

  private emitState(active: boolean): void {
    this.stateSubject.next({
      active,
      currentStep: active ? this.steps[this.currentIndex] : null,
      currentIndex: this.currentIndex,
      totalSteps: this.steps.length
    });
  }
}
