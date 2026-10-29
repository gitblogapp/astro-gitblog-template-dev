import { loadBlog } from '../lib/template/content';
import { llmsText } from '../lib/template/discovery';
export function GET() {
  return new Response(llmsText(loadBlog()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
