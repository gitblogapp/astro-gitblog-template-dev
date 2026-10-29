import { loadBlog } from '../../lib/template/content';
import { discoveryManifest } from '../../lib/template/discovery';
export function GET() {
  return Response.json(discoveryManifest(loadBlog()));
}
