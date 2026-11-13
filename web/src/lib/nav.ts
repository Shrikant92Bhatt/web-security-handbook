import { getCollection, type CollectionEntry } from 'astro:content';

export type Page = { id: string; title: string; label: string; url: string; section: string; file: string; isOverview?: boolean };
export type Section = { id: string; dir: string; title: string; label: string; url?: string; pages: Page[]; index: number };
export type Module = { id: string; title: string; shortTitle: string; url?: string; sections: Section[]; blurb: string };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const urlFor = (id: string) => `${BASE}/${id}/`;

export function titleOf(e: CollectionEntry<'handbook'>): string {
  const m = (e.body || '').match(/^#\s+(.+)$/m);
  if (m) return m[1].replace(/[`*_]/g, '').trim();
  return prettify(e.id.split('/').pop()!);
}

export function plainTitle(t: string): string {
  return t
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^(Module\s+\d+\s*[—–-]\s*)/i, '')
    .trim();
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
  const all = (await getCollection('handbook')).sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true })
  );
  const modules = new Map<string, Module>();

  const getModule = (key: string, title: string, shortTitle: string) => {
    if (!modules.has(key)) {
      modules.set(key, { id: key, title, shortTitle, sections: [], blurb: '' });
    }
    return modules.get(key)!;
  };

  for (const e of all) {
    const parts = e.id.split('/');
    const isModule = /^Module-/.test(parts[0]);
    const title = titleOf(e);

    // Hide internal authoring meta-docs under Module-1/docs/ from primary learner navigation
    if (isModule && parts[1] === 'docs' && /CHAPTER-AUTHORING-GUIDE|INFORMATION-ARCHITECTURE|ATTACK-PLAYBOOK-TEMPLATE/i.test(e.id)) {
      continue;
    }

    if (isModule && parts.length === 1) {
      const num = parts[0].match(/^Module-(\d+)/)?.[1] ?? '';
      const cleanName = prettify(parts[0].replace(/^Module-\d+-?/, ''));
      const m = getModule(parts[0], title, num ? `Module ${num}: ${cleanName}` : cleanName);
      m.title = title;
      m.url = urlFor(e.id);
      m.blurb = firstParagraph(e.body);
      continue;
    }

    const num = parts[0].match(/^Module-(\d+)/)?.[1] ?? '';
    const cleanMod = prettify(parts[0].replace(/^Module-\d+-?/, ''));
    const mod = isModule
      ? getModule(parts[0], cleanMod, num ? `Module ${num}: ${cleanMod}` : cleanMod)
      : getModule('extras', 'Resources & Reference', 'Resources & Labs');

    // Group nested sub-tracks (like 15-fullstack-interview/react or nodejs) cleanly
    const hasSubfolder = isModule && parts.length >= 3 && ['react', 'nodejs', 'core-web-development'].includes(parts[2]);
    const secId = isModule
      ? hasSubfolder
        ? parts.slice(0, 3).join('/')
        : parts.slice(0, 2).join('/')
      : 'extras';
    const dirName = isModule ? (hasSubfolder ? `${parts[1]}/${parts[2]}` : parts[1]) : 'resources';

    let sec = mod.sections.find((s) => s.id === secId);
    if (!sec) {
      const defaultLabel = isModule
        ? hasSubfolder
          ? `${prettify(parts[1])} · ${prettify(parts[2])}`
          : prettify(parts[1])
        : 'Resources, Glossary & References';
      sec = {
        id: secId,
        dir: dirName,
        title: defaultLabel,
        label: defaultLabel,
        pages: [],
        index: mod.sections.length,
      };
      mod.sections.push(sec);
    }

    const last = parts[parts.length - 1];
    const isSecReadme = isModule && e.id === secId;
    const file = isSecReadme ? 'README.md' : `${last}.md`;
    const cleanLabel = plainTitle(title);

    const page: Page = {
      id: e.id,
      title,
      label: isSecReadme ? `${cleanLabel} (Overview)` : cleanLabel,
      url: urlFor(e.id),
      section: secId,
      file,
      isOverview: isSecReadme,
    };

    if (isSecReadme) {
      sec.title = title;
      sec.label = hasSubfolder ? `${prettify(parts[2])} Track` : prettify(parts[1]);
      sec.url = page.url;
      page.label = 'Overview & Guide';
      sec.pages.unshift(page);
    } else {
      sec.pages.push(page);
    }
  }

  const list = [...modules.values()].filter((m) => m.sections.length || m.url);
  list.sort((a, b) => (a.id === 'extras' ? 1 : b.id === 'extras' ? -1 : 0));
  const flat: Page[] = list.flatMap((m) => m.sections.flatMap((s) => s.pages));
  return { modules: list, flat };
}

export async function getEntryMeta(id: string) {
  const { modules, flat } = await getNav();
  const i = flat.findIndex((p) => p.id === id);
  const page = flat[i];
  let section: Section | undefined,
    module: Module | undefined;
  for (const m of modules) {
    if (m.id === id) module = m;
    for (const s of m.sections) {
      if (s.pages.some((p) => p.id === id)) {
        section = s;
        module = m;
      }
    }
  }
  return { page, section, module, prev: i > 0 ? flat[i - 1] : undefined, next: i >= 0 ? flat[i + 1] : undefined };
}
