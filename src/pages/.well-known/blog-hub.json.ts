import { loadConfig } from '../../lib/template/config';
import { manifest } from '../../lib/template/outputs';
export function GET() {
  return Response.json(manifest(loadConfig()));
}
