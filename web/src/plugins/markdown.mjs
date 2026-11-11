import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const BASE = (process.env.BASE || '/web-security-handbook').replace(/\/$/, '');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function walk(node, fn) {
  fn(node);
  if (node.children) node.children.forEach((c) => walk(c, fn));
}

/** Turn ```mermaid blocks into <pre class="mermaid"> so the browser renders them as diagrams. */
export function remarkMermaid() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type === 'code' && node.lang === 'mermaid') {
        node.type = 'html';
        node.value = `<div class="diagram"><pre class="mermaid">${esc(node.value)}</pre></div>`;
      }
    });
  };
}

/** Convert a repo-relative markdown path into a site URL. */
export function pathToUrl(relPath) {
  const id = relPath
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .replace(/\/README$/i, '');
  return `${BASE}/${id}/`;
}

/** Rewrite relative links like ../02-auth/jwt-security.md#x to site routes. */
export function remarkRewriteLinks() {
  return (tree, file) => {
    const from = file.path;
    if (!from) return;
    walk(tree, (node) => {
      if (node.type !== 'link' || !node.url) return;
      const url = node.url;
      if (/^([a-z]+:|#|\/\/)/i.test(url)) return;
      const [p, hash] = url.split('#');
      if (!/\.md$/i.test(p)) return;
      const abs = path.resolve(path.dirname(from), p);
      const rel = path.relative(ROOT, abs);
      if (rel.startsWith('..')) return;
      node.url = pathToUrl(rel) + (hash ? `#${hash}` : '');
    });
  };
}
