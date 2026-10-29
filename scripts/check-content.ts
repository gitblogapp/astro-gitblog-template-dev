import { loadBlog } from '../src/lib/template/content';
const blog = loadBlog();
console.log(
  `Validated ${blog.originals.length} original IDs, ${blog.posts.length} public language variants. No source files changed.`,
);
