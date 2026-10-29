import { loadBlog } from '../lib/template/content';
import { sitemap } from '../lib/template/outputs';
export function GET() {
  return new Response(sitemap(loadBlog()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
