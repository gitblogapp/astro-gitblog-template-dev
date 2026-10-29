import { loadBlog } from '../../lib/template/content';
import { loadConfig } from '../../lib/template/config';
import { rss } from '../../lib/template/outputs';
export function getStaticPaths() {
  const config = loadConfig();
  return config.locales.map((locale) => ({
    params: { locale: locale === config.sourceLocale ? undefined : locale },
    props: { locale },
  }));
}
export function GET({ props }: { props: { locale: string } }) {
  return new Response(rss(loadBlog(), props.locale), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
