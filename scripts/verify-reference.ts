import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';
import { loadConfig } from '../src/lib/template/config';
import { loadBlog, giscusTerm } from '../src/lib/template/content';
import { absolute, postPath } from '../src/lib/template/urls';
import { snapshot } from './preservation';
const reference = process.argv[2] && path.resolve(process.argv[2]);
if (!reference || !fs.existsSync(path.join(reference, 'content/posts')))
  throw new Error('Usage: npm run test:reference -- /path/to/existing/blog');
const source = loadBlog(loadConfig(reference));
const protectedPaths = ['content', 'static', '.env.production', '.pages.yml', 'src'];
const before = snapshot(reference, protectedPaths);
const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'margin-reference-'));
try {
  for (const entry of ['src', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json'])
    fs.cpSync(path.join(root, entry), path.join(temp, entry), { recursive: true });
  for (const entry of ['content', 'static', '.env.production', '.pages.yml'])
    if (fs.existsSync(path.join(reference, entry)))
      fs.cpSync(path.join(reference, entry), path.join(temp, entry), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
  const result = spawnSync(
    process.execPath,
    [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build'],
    { cwd: temp, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const post of source.posts) {
    const prefix = post.locale === source.config.sourceLocale ? '' : `${post.locale}/`;
    const html = fs.readFileSync(
      path.join(temp, 'build', prefix, 'blog', post.slug, 'index.html'),
      'utf8',
    );
    const $ = load(html);
    assert.equal($('#post-title').text(), post.title);
    assert.equal(
      $('link[rel=canonical]').attr('href'),
      absolute(source.config, postPath(source.config, post.locale, post.slug)),
    );
    if (source.config.site.giscusRepo) {
      assert.equal($('.giscus').attr('data-term'), giscusTerm(post.id));
      assert.equal($('.giscus').attr('data-repo'), source.config.site.giscusRepo);
    }
  }
  assert.deepEqual(snapshot(reference, protectedPaths), before);
  console.log(
    `PASS reference: ${source.originals.length} originals, ${source.posts.length} public variants (${source.config.locales.join(', ')}), canonical URLs and Giscus mappings preserved; source unchanged.`,
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
