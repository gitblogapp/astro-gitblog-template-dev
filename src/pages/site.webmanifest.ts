import { loadConfig } from '../lib/template/config';
import { homePath, withBase } from '../lib/template/urls';
export const prerender = true;
export function GET() {
  const config = loadConfig();
  return new Response(
    JSON.stringify({
      name: config.site.title,
      short_name: config.site.title,
      lang: config.sourceLocale,
      start_url: homePath(config, config.sourceLocale),
      scope: `${config.base}/`,
      display: 'standalone',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [
        {
          src: withBase(config, '/favicon.svg'),
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
}
