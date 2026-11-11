import { getCollection, type CollectionEntry } from 'astro:content';

export type Page = { id: string; title: string; url: string; section: string };
export type Section = { id: string; title: string; url?: string; pages: Page[]; hue: number; index: number };
export type Module = { id: string; title: string; url?: string; sections: Section[]; hue: number; blurb: string };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const urlFor = (id: string) => `${BASE}/${id}/`;

// Hues cycle so every section gets its own colour (multicolor theme).
const HUES = [262, 330, 24, 160, 200, 45, 290, 12, 140, 220, 340, 80];

export function titleOf(e: CollectionEntry<'handbook'>): string {
  const m = (e.body || '').match(/^#\s+(.+)$/m);
  if (m) return m[1].replace(/[`*_]/g, '').trim();
  return prettify(e.id.split('/').pop()!);
}

export function plainTitle(t: string): string {
  return t.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

export function emojiOf(t: string): string {
  const m = t.match(/^([^\p{L}\p{N}\s]+)/u);
  return m ? m[1] : '📘';
}

function prettify(s: string): string {
  return s
    .replace(/^\d+[-_]/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function firstParagraph(body = ''): string {
  const lines = body.split('\n');
  for (const l of lines) {
    const t = l.trim();
    if (t.startsWith('>')) return t.replace(/^>\s*/, '').replace(/[*_`]/g, '');
  }
  for (const l of lines) {
    const t = l.trim();
    if (t && !/^[#\-|`>\d]/.test(t)) return t.replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  }
  return '';
}

export async function getNav() {
  const all = (await getCollection('handbook')).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const modules = new Map<string, Module>();
  let hueIdx = 0;

  const getModule = (key: string, title: string) => {
    if (!modules.has(key)) {
      modules.set(key, { id: key, title, sections: [], hue: HUES[modules.size % HUES.length], blurb: '' });
    }
    return modules.get(key)!;
  };

  for (const e of all) {
    const parts = e.id.split('/');
    const isModule = /^Module-/.test(parts[0]);
    const title = titleOf(e);
    if (isModule && parts.length === 1) {
      const m = getModule(parts[0], prettify(parts[0].replace(/^Module-\d+-?/, '')));
      m.title = title;
      m.url = urlFor(e.id);
      m.blurb = firstParagraph(e.body);
      continue;
    }
    const mod = isModule ? getModule(parts[0], prettify(parts[0])) : getModule('extras', '📚 Resources & Labs');
    const secId = isModule ? parts.slice(0, 2).join('/') : 'extras';
    let sec = mod.sections.find((s) => s.id === secId);
    if (!sec) {
      sec = {
        id: secId,
        title: isModule ? prettify(parts[1]) : 'Resources, Labs & Diagrams',
        pages: [],
        hue: HUES[hueIdx++ % HUES.length],
        index: mod.sections.length,
      };
      mod.sections.push(sec);
    }
    const page: Page = { id: e.id, title, url: urlFor(e.id), section: secId };
    // A README for a section: its id equals the section id.
    if (isModule && e.id === secId) {
      sec.title = title;
      sec.url = page.url;
      sec.pages.unshift(page);
    } else {
      sec.pages.push(page);
    }
  }

  const list = [...modules.values()].filter((m) => m.sections.length || m.url);
  // Put the "extras" module last.
  list.sort((a, b) => (a.id === 'extras' ? 1 : b.id === 'extras' ? -1 : 0));
  const flat: Page[] = list.flatMap((m) => m.sections.flatMap((s) => s.pages));
  return { modules: list, flat };
}

export async function getEntryMeta(id: string) {
  const { modules, flat } = await getNav();
  const i = flat.findIndex((p) => p.id === id);
  const page = flat[i];
  let section: Section | undefined, module: Module | undefined;
  for (const m of modules)
    for (const s of m.sections) if (s.pages.some((p) => p.id === id)) { section = s; module = m; }
  return { page, section, module, prev: i > 0 ? flat[i - 1] : undefined, next: flat[i + 1] };
}
