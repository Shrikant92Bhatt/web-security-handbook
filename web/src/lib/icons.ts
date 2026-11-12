import fs from 'node:fs';
import path from 'node:path';
import * as si from 'simple-icons';

// Maps a page/section name to the best icon.
// 1) real brand logos (simple-icons) for technologies and databases
// 2) generic line icons (lucide) for security concepts
// To add/change an icon, add a line to BRANDS or CONCEPTS below. First match wins.

const BRANDS: [RegExp, string][] = [
  [/redis/, 'siRedis'],
  [/postgres/, 'siPostgresql'],
  [/mongo/, 'siMongodb'],
  [/mariadb/, 'siMariadb'],
  [/mysql/, 'siMysql'],
  [/sqlite/, 'siSqlite'],
  [/elasticsearch|elastic/, 'siElasticsearch'],
  [/cassandra/, 'siApachecassandra'],
  [/neo4j/, 'siNeo4j'],
  [/kafka/, 'siApachekafka'],
  [/rabbitmq/, 'siRabbitmq'],
  [/nginx/, 'siNginx'],
  [/docker/, 'siDocker'],
  [/kubernetes|k8s/, 'siKubernetes'],
  [/github-actions|github actions|cicd/, 'siGithubactions'],
  [/pm2/, 'siPm2'],
  [/openapi|swagger/, 'siSwagger'],
  [/jwt|json web token/, 'siJsonwebtokens'],
  [/owasp/, 'siOwasp'],
  [/graphql/, 'siGraphql'],
  [/prisma/, 'siPrisma'],
  [/sequelize/, 'siSequelize'],
  [/cloudflare/, 'siCloudflare'],
  [/hostinger/, 'siHostinger'],
  [/gcp|google cloud/, 'siGooglecloud'],
  [/letsencrypt|let's encrypt/, 'siLetsencrypt'],
  [/angular/, 'siAngular'],
  [/react/, 'siReact'],
  [/typescript|typescript/, 'siTypescript'],
  [/javascript/, 'siJavascript'],
  [/node/, 'siNodedotjs'],
  [/\bexpress\b/, 'siExpress'],
  [/\bvite\b/, 'siVite'],
  [/webpack/, 'siWebpack'],
  [/css\b|styling/, 'siCss'],
  [/html/, 'siHtml5'],
];

const CONCEPTS: [RegExp, string][] = [
  [/xss|cross-site-scripting/, 'code'],
  [/csrf|cross-site-request/, 'shield-alert'],
  [/cors|cross-origin/, 'globe'],
  [/clickjack/, 'mouse-pointer-click'],
  [/content-security|csp/, 'shield-check'],
  [/same-origin/, 'link-2'],
  [/storage/, 'hard-drive'],
  [/session|refresh-token/, 'timer'],
  [/oauth|oidc|auth/, 'key-round'],
  [/password|crypto/, 'lock'],
  [/idor|bola|bfla|tenant/, 'user-x'],
  [/rbac|abac|rebac|authoriz/, 'users'],
  [/rate-limit|throttl/, 'gauge'],
  [/idempot/, 'repeat'],
  [/load-balanc/, 'network'],
  [/websocket|sse|realtime/, 'radio'],
  [/performance|optimi/, 'zap'],
  [/api/, 'plug'],
  [/sqli|sql|injection/, 'database'],
  [/ssrf/, 'server-crash'],
  [/https|tls|pki|certificate/, 'lock-keyhole'],
  [/header|http/, 'globe'],
  [/database|index|migration|data/, 'database'],
  [/upload|serializ/, 'upload'],
  [/aws|azure|cloud|serverless|deploy|devops|infra/, 'cloud'],
  [/micro-?frontend|modern-app/, 'layout-grid'],
  [/test|tool|lab|bootcamp/, 'flask-conical'],
  [/checklist|prevention/, 'list-checks'],
  [/interview|question/, 'messages-square'],
  [/system-design|design|architecture/, 'layout-dashboard'],
  [/glossary/, 'book-open'],
  [/video/, 'circle-play'],
  [/reference/, 'bookmark'],
  [/foundation|fundamental|basics|core/, 'graduation-cap'],
  [/diagram|map|catalog|matrix/, 'workflow'],
  [/frontend|browser/, 'monitor'],
  [/backend|server/, 'server'],
  [/study-plan|plan/, 'calendar-check'],
  [/function|class|interface|type|object|narrowing|generic/, 'braces'],
];

const lucideDir = path.resolve('node_modules/lucide-static/icons');
const cache = new Map<string, string>();

function luminance(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function lucide(name: string): string | null {
  const f = path.join(lucideDir, `${name}.svg`);
  if (!fs.existsSync(f)) return null;
  return fs
    .readFileSync(f, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/class="[^"]*"/, 'class="i-line"')
    .replace(/width="24"/, 'width="1em"')
    .replace(/height="24"/, 'height="1em"')
    .replace(/stroke-width="2"/, 'stroke-width="1.75"')
    .trim();
}

/** Returns an inline <svg> string for the given name (file name, folder name or title). */
export function iconFor(raw: string, fallback = 'file-text'): string {
  const key = raw.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
  let svg: string | null = null;
  for (const [re, slug] of BRANDS) {
    if (re.test(key)) {
      const icon = (si as any)[slug];
      if (icon) {
        const fill = luminance(icon.hex) < 0.3 ? 'currentColor' : `#${icon.hex}`;
        svg = `<svg class="i-brand" viewBox="0 0 24 24" width="1em" height="1em" fill="${fill}" aria-hidden="true"><path d="${icon.path}"/></svg>`;
        break;
      }
    }
  }
  if (!svg) {
    for (const [re, name] of CONCEPTS) {
      if (re.test(key)) { svg = lucide(name); if (svg) break; }
    }
  }
  svg ??= lucide(fallback) ?? '';
  cache.set(key, svg);
  return svg;
}

export const folderIcon = () => lucide('folder') ?? '';
