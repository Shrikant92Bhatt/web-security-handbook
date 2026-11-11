import { getCollection } from 'astro:content';
import { getNav } from '../lib/nav';

export async function GET() {
  const { flat, modules } = await getNav();
  const entries = await getCollection('handbook');
  const secTitle = new Map<string, string>();
  modules.forEach((m) => m.sections.forEach((s) => secTitle.set(s.id, s.title)));
  const docs = entries.map((e) => {
    const p = flat.find((f) => f.id === e.id);
    const body = e.body ?? '';
    const heads = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].replace(/[`*]/g, '')).join(' | ');
    const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`|\[\]()_-]/g, ' ').replace(/\s+/g, ' ').slice(0, 2500);
    return { t: p?.title ?? e.id, u: p?.url ?? '', s: secTitle.get(p?.section ?? '') ?? '', h: heads, x: text };
  });
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
}
