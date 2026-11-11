import fs from 'node:fs';
import path from 'node:path';

export interface GlossaryTerm {
  number: number;
  term: string;
  group: string;
  definition: string;
  anchors: string;
  boundary: string;
  category: string;
}

let cachedTerms: GlossaryTerm[] | null = null;

export function getGlossaryTerms(): GlossaryTerm[] {
  if (cachedTerms) return cachedTerms;

  const filePath = path.resolve(process.cwd(), 'glossary.md');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const sections = raw.split(/^## /m).slice(1);
  const terms: GlossaryTerm[] = [];

  for (const sec of sections) {
    const firstLine = sec.split('\n')[0]?.trim() || '';
    if (firstLine.startsWith('Usage Rules')) continue;
    const group = firstLine.replace(/\s*\(\d+\s*terms\)\s*$/i, '').trim();

    const entries = sec.split(/^### /m).slice(1);
    for (const entry of entries) {
      const lines = entry.trim().split('\n');
      const titleMatch = lines[0]?.match(/^(\d+)\.\s+(.+)$/);
      if (!titleMatch) continue;

      const number = Number(titleMatch[1]);
      const term = titleMatch[2].replace(/\*/g, '').trim();

      const defMatch = entry.match(/-\s+\*\*Definition:\*\*\s+(.+)/);
      const ancMatch = entry.match(/-\s+\*\*Anchors:\*\*\s+(.+)/);
      const bndMatch = entry.match(/-\s+\*\*Boundary:\*\*\s+(.+)/);
      const catMatch = entry.match(/-\s+\*\*Category:\*\*\s+(.+)/);

      terms.push({
        number,
        term,
        group,
        definition: defMatch ? defMatch[1].trim() : '',
        anchors: ancMatch ? ancMatch[1].trim() : '',
        boundary: bndMatch ? bndMatch[1].replace(/\*/g, '').trim() : '',
        category: catMatch ? catMatch[1].trim() : '',
      });
    }
  }

  cachedTerms = terms;
  return terms;
}
