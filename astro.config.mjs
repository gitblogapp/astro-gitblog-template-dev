import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './src/lib/template/config.ts';
const config = loadConfig();
export default defineConfig({
  site: new URL(config.siteUrl).origin,
  base: config.base || '/',
  output: 'static',
  outDir: './build',
  trailingSlash: 'always',
  publicDir: './static',
  devToolbar: { enabled: false },
  // Keep runtime Pagefind imports in emitted JS so Vite finalizes its preload code.
  vite: {
    // Fixture builds share node_modules, but must never share Vite optimizer state.
    cacheDir: fileURLToPath(new URL('./.astro/vite', import.meta.url)),
    build: {
      assetsInlineLimit: (file) => (file.endsWith('.js') ? false : undefined),
    },
  },
  integrations: [
    {
      name: 'gitblog-content-reload',
      hooks: {
        'astro:server:setup': ({ server }) => {
          server.watcher.add('content');
          server.watcher.on('all', (_, file) => {
            if (file.includes('/content/')) {
              server.moduleGraph.invalidateAll();
              server.ws.send({ type: 'full-reload' });
            }
          });
        },
      },
    },
  ],
});
