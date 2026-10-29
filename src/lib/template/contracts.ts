import type { Site } from './config';
import type { Post } from './content';
export type ExtensionSlot = 'article-before-body' | 'article-after-body' | 'site-footer';
export interface ExtensionContext {
  site: Site;
  locale: string;
  pathname: string;
  post?: Post;
}
export const themeApiVersion = 1;
export const extensionApiVersion = 1;
