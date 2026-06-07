import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { HELP_ARTICLES } from './data/help-articles.data';
import { HelpArticle } from './models/help-article.model';

/**
 * Individual help article page.
 * Renders the full article content with basic markdown-to-HTML conversion.
 * Includes video placeholder support for training materials.
 */
@Component({
  selector: 'app-help-article',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-breadcrumb [items]="[
      {label: 'Home', url: '/dashboard'},
      {label: 'Help Centre', url: '/help'},
      {label: article?.category?.label ?? 'Category', url: '/help/' + categoryId},
      {label: article?.title ?? 'Article'}
    ]"></app-breadcrumb>

    @if (article) {
      <app-page-header [title]="article.title" [subtitle]="'Last updated: ' + article.lastUpdated"></app-page-header>

      <!-- Video Placeholder -->
      @if (article.video) {
        <div class="card bg-base-200 border border-base-300 mb-6">
          <div class="card-body flex-row items-center gap-4">
            <div class="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-base-content">🎬 {{ article.video.title }}</h3>
              <p class="text-sm text-base-content/60 mt-1">{{ article.video.description }}</p>
              <div class="flex items-center gap-3 mt-2">
                <span class="badge badge-ghost badge-sm">{{ article.video.duration }}</span>
                @if (article.video.url) {
                  <a [href]="article.video.url" target="_blank" rel="noopener" class="btn btn-primary btn-xs">Watch Video</a>
                } @else {
                  <span class="text-xs text-base-content/40 italic">Video coming soon</span>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Article Content -->
      <div class="card bg-base-100 border border-base-300 mb-6">
        <div class="card-body">
          <div class="text-sm text-base-content/80 leading-relaxed whitespace-pre-line" [innerHTML]="formattedContent"></div>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex items-center gap-2 mb-6">
        <span class="text-sm text-base-content/50">Tags:</span>
        @for (tag of article.tags; track tag) {
          <span class="badge badge-ghost badge-sm">{{ tag }}</span>
        }
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center">
        <a [routerLink]="['/help', categoryId]" class="btn btn-ghost btn-sm">
          ← Back to {{ article.category.label }}
        </a>
        <a routerLink="/help" class="btn btn-ghost btn-sm">
          Help Centre Home
        </a>
      </div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center">
        <div class="text-4xl mb-4">📄</div>
        <h3 class="text-lg font-semibold">Article Not Found</h3>
        <p class="text-base-content/60 mt-2">The requested help article could not be found.</p>
        <a routerLink="/help" class="btn btn-primary btn-sm mt-4">Return to Help Centre</a>
      </div>
    }
  `
})
export class HelpArticleComponent implements OnInit {
  article: HelpArticle | undefined;
  categoryId = '';
  formattedContent = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') ?? '';
    const articleId = this.route.snapshot.paramMap.get('articleId') ?? '';
    this.article = HELP_ARTICLES.find(a => a.id === articleId);

    if (this.article) {
      this.formattedContent = this.formatContent(this.article.content);
    }
  }

  /**
   * Basic markdown-to-HTML conversion for headings, tables, bold, and lists.
   * In production, use a proper markdown renderer.
   */
  private formatContent(content: string): string {
    return content
      .replace(/^## (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^\| (.+) \|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        const row = cells.map(c => `<td class="px-3 py-1 border border-base-300">${c.trim()}</td>`).join('');
        return `<tr>${row}</tr>`;
      })
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  }
}
