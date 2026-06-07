import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../shared/components/page-description/page-description.component';
import { HELP_CATEGORIES, HELP_ARTICLES, FAQ_ITEMS, GLOSSARY_TERMS } from './data/help-articles.data';
import { HelpArticle, HelpCategory, FaqItem, GlossaryTerm } from './models/help-article.model';

/**
 * Help category page. Shows articles in a given category, or FAQ/Glossary pages.
 */
@Component({
  selector: 'app-help-category',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, PageHeaderComponent, PageDescriptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Help Centre', url: '/help'},
      {label: category?.label ?? 'Category'}
    ]"></app-breadcrumb>

    @if (category) {
      <app-page-header [title]="category.icon + ' ' + category.label" [subtitle]="category.description"></app-page-header>
      <app-page-description
        [description]="'Browse all articles in the ' + category.label + ' category.'"
        guidance="Click any article to read the full guide."
        helpLink="/help"
      ></app-page-description>
    }

    <!-- Regular articles -->
    @if (categoryId !== 'faq' && categoryId !== 'glossary') {
      <div class="grid gap-4">
        @for (article of articles; track article.id) {
          <a [routerLink]="['/help', categoryId, article.id]"
             class="card bg-base-100 border border-base-300 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
            <div class="card-body p-5">
              <h3 class="font-semibold text-base-content">{{ article.title }}</h3>
              <p class="text-sm text-base-content/60 mt-1">{{ article.summary }}</p>
              <div class="flex gap-2 mt-3">
                @for (tag of article.tags.slice(0, 3); track tag) {
                  <span class="badge badge-ghost badge-sm">{{ tag }}</span>
                }
              </div>
            </div>
          </a>
        }
        @if (articles.length === 0) {
          <div class="card bg-base-100 border border-base-300 p-8 text-center">
            <p class="text-base-content/60">No articles in this category yet.</p>
            <a routerLink="/help" class="btn btn-ghost btn-sm mt-4">Back to Help Centre</a>
          </div>
        }
      </div>
    }

    <!-- FAQ -->
    @if (categoryId === 'faq') {
      <div class="space-y-3">
        @for (item of faqItems; track item.question) {
          <div class="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" [name]="'faq-accordion'" />
            <div class="collapse-title font-medium text-base-content">
              {{ item.question }}
            </div>
            <div class="collapse-content">
              <p class="text-sm text-base-content/70 leading-relaxed">{{ item.answer }}</p>
              <span class="badge badge-ghost badge-sm mt-2">{{ item.category }}</span>
            </div>
          </div>
        }
      </div>
    }

    <!-- Glossary -->
    @if (categoryId === 'glossary') {
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th class="w-48">Term</th>
              <th>Definition</th>
              <th class="w-32">Module</th>
            </tr>
          </thead>
          <tbody>
            @for (term of glossaryTerms; track term.term) {
              <tr>
                <td class="font-medium">{{ term.term }}</td>
                <td class="text-sm text-base-content/70">{{ term.definition }}</td>
                <td><span class="badge badge-ghost badge-sm">{{ term.module }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `
})
export class HelpCategoryComponent implements OnInit {
  categoryId = '';
  category: HelpCategory | undefined;
  articles: HelpArticle[] = [];
  faqItems: FaqItem[] = FAQ_ITEMS;
  glossaryTerms: GlossaryTerm[] = GLOSSARY_TERMS;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') ?? '';
    this.category = HELP_CATEGORIES.find(c => c.id === this.categoryId);
    this.articles = HELP_ARTICLES.filter(a => a.category.id === this.categoryId);
  }
}
