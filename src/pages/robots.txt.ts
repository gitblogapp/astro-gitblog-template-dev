import { loadConfig } from '../lib/template/config';
import { robotsText } from '../lib/template/ai-policy';
export function GET() {
  const config = loadConfig();
  return new Response(robotsText(config.policy, config.siteUrl), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
