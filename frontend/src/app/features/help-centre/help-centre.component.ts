import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';
import { SearchBoxComponent } from '../../shared/components/search-box/search-box.component';
import { GuidedTourService } from '../../core/services/guided-tour.service';
import { HELP_CATEGORIES, HELP_ARTICLES } from './data/help-articles.data';
import { HelpArticle, HelpCategory } from './models/help-article.model';

/**
 * Help Centre landing page.
 * Provides categorised access to knowledge base, searchable articles, and quick links.
 */
@Component({
  selector: 'app-help-centre',
  standalone: true,
  imports: [
    CommonModule, RouterLink, BreadcrumbComponent,
    PageHeaderComponent, PageDescriptionComponent, SearchBoxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'}, {label: 'Help Centre'}]"></app-breadcrumb>
    <app-page-header title="Help Centre" subtitle="Find answers, guides, and documentation"></app-page-header>
    <app-page-description
      description="Welcome to the BuildEstate Pro Help Centre. Browse by category, search for topics, or explore frequently asked questions. Every feature of the platform is documented here."
      guidance="New to the platform? Start with the Getting Started guides below."
    ></app-page-description>

    <!-- Search -->
    <div class="mb-8">
      <app-search-box
        placeholder="Search help articles, guides, and glossary..."
        (searchChanged)="onSearch($event)"
      ></app-search-box>
    </div>

    <!-- Search Results -->
    @if (searchTerm) {
      <div class="mb-8">
        <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">
          Search Results ({{ searchResults.length }})
        </h2>
        @if (searchResults.length === 0) {
          <div class="card bg-base-100 border border-base-300 p-6 text-center">
            <p class="text-base-content/60">No articles found for "{{ searchTerm }}"</p>
            <p class="text-sm text-base-content/40 mt-2">Try different keywords or browse the categories below.</p>
          </div>
        } @else {
          <div class="grid gap-3">
            @for (article of searchResults; track article.id) {
              <a [routerLink]="['/help', article.category.id, article.id]"
                 class="card bg-base-100 border border-base-300 hover:border-primary/50 transition-colors cursor-pointer">
                <div class="card-body p-4">
                  <div class="flex items-start gap-3">
                    <span class="text-lg">{{ article.category.icon }}</span>
                    <div>
                      <h3 class="font-medium text-base-content">{{ article.title }}</h3>
                      <p class="text-sm text-base-content/60 mt-1">{{ article.summary }}</p>
                      <span class="badge badge-ghost badge-sm mt-2">{{ article.category.label }}</span>
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    }

    <!-- Categories Grid -->
    @if (!searchTerm) {
      <!-- Quick Access -->
      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Quick Access</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <a routerLink="/help/user-bible" class="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all text-center p-4">
          <span class="text-2xl">📖</span>
          <p class="text-sm font-medium mt-2">User Bible</p>
          <p class="text-xs text-base-content/50">Complete reference</p>
        </a>
        <a routerLink="/help/learning-paths" class="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all text-center p-4">
          <span class="text-2xl">🎓</span>
          <p class="text-sm font-medium mt-2">Learning Paths</p>
          <p class="text-xs text-base-content/50">Role-based guides</p>
        </a>
        <a routerLink="/help/release-notes" class="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all text-center p-4">
          <span class="text-2xl">📋</span>
          <p class="text-sm font-medium mt-2">Release Notes</p>
          <p class="text-xs text-base-content/50">What's new</p>
        </a>
        <button (click)="restartTour()" class="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all text-center p-4 cursor-pointer">
          <span class="text-2xl">🚀</span>
          <p class="text-sm font-medium mt-2">Restart Tour</p>
          <p class="text-xs text-base-content/50">Guided walkthrough</p>
        </button>
      </div>

      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Browse by Category</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        @for (category of categories; track category.id) {
          <a [routerLink]="['/help', category.id]"
             class="card bg-base-100 border border-base-300 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
            <div class="card-body p-5">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">{{ category.icon }}</span>
                <h3 class="font-semibold text-base-content">{{ category.label }}</h3>
              </div>
              <p class="text-sm text-base-content/60">{{ category.description }}</p>
            </div>
          </a>
        }
      </div>

      <!-- Quick Links -->
      <h2 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">Popular Articles</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        @for (article of popularArticles; track article.id) {
          <a [routerLink]="['/help', article.category.id, article.id]"
             class="flex items-center gap-3 p-3 rounded-lg bg-base-100 border border-base-300 hover:border-primary/50 transition-colors">
            <span class="text-primary">📄</span>
            <div>
              <p class="text-sm font-medium text-base-content">{{ article.title }}</p>
              <p class="text-xs text-base-content/50">{{ article.category.label }}</p>
            </div>
          </a>
        }
      </div>
    }
  `
})
export class HelpCentreComponent {
  categories: HelpCategory[] = HELP_CATEGORIES;
  articles: HelpArticle[] = HELP_ARTICLES;
  searchResults: HelpArticle[] = [];
  searchTerm = '';

  /** First 6 articles as popular/featured */
  popularArticles: HelpArticle[] = HELP_ARTICLES.slice(0, 6);

  constructor(private tourService: GuidedTourService) {}

  onSearch(term: string): void {
    this.searchTerm = term;
    if (!term.trim()) {
      this.searchResults = [];
      return;
    }
    const lower = term.toLowerCase();
    this.searchResults = this.articles.filter(a =>
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.tags.some(t => t.includes(lower))
    );
  }

  restartTour(): void {
    this.tourService.reset();
    this.tourService.startOnboarding();
  }
}
