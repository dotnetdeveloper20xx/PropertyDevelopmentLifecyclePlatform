/**
 * Help Centre domain models.
 * Supports the searchable knowledge base, categorised articles, and glossary.
 */

export interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: HelpCategory;
  tags: string[];
  relatedArticles?: string[];
  lastUpdated: string;
  icon?: string;
  /** Optional video tutorial linked to this article */
  video?: VideoPlaceholder;
}

export interface VideoPlaceholder {
  title: string;
  duration: string;
  description: string;
  /** URL will be populated when video is available; null = placeholder */
  url?: string;
}

export interface HelpCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  articleCount?: number;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
  module?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export type HelpCategoryId =
  | 'getting-started'
  | 'land-acquisition'
  | 'workflows'
  | 'roles'
  | 'modules'
  | 'faq'
  | 'glossary';
