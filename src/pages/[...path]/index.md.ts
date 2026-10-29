import { loadBlog } from '../../lib/template/content';
import { articleLinks, publicMarkdown } from '../../lib/template/discovery';
export function getStaticPaths() {
  const blog = loadBlog();
  if (!blog.config.policy.markdown) return [];
  return blog.posts.map((post) => ({
    params: {
      path: `${post.locale === blog.config.sourceLocale ? '' : `${post.locale}/`}blog/${post.slug}`,
    },
    props: { locale: post.locale, slug: post.slug },
  }));
}
export function GET({ props }: { props: { locale: string; slug: string } }) {
  const blog = loadBlog();
  const post = blog.posts.find((post) => post.locale === props.locale && post.slug === props.slug);
  if (!post || !blog.config.policy.markdown) return new Response('Not found', { status: 404 });
  return new Response(publicMarkdown(blog, post), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Link: `<${articleLinks(blog, post).canonicalUrl}>; rel="canonical"`,
    },
  });
}
