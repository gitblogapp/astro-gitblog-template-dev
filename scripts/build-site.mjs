import { buildWithCoverImages } from '@gitblogapp/cli/cover-images';

await buildWithCoverImages({
  command: process.execPath,
  args: ["node_modules/astro/bin/astro.mjs", "build"].concat(process.argv.slice(2))
});
