import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

export async function renderArticleProse(rawBody: string): Promise<{
  part1Html: string;
  part2Html: string;
  wordCount: number;
  readingMinutes: number;
}> {
  const withoutAudit = rawBody.split('<!-- AUDIT-BELOW -->')[0] || '';
  const proseOnly = withoutAudit.split('<!-- END-PROSE -->')[0] || '';

  const words = proseOnly
    .replace(/[*_>#`|-]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
  const readingMinutes = Math.max(4, Math.round((words + 180) / 210));

  const splitMarker = '\n## What This Means for You';
  const idx = proseOnly.indexOf(splitMarker);

  let md1 = proseOnly;
  let md2 = '';
  if (idx !== -1) {
    md1 = proseOnly.slice(0, idx).trim();
    md2 = proseOnly.slice(idx).trim();
  }

  const wrapSections = (html: string): string => {
    const chunks = html.split(/(?=<h2>)/g);
    return chunks
      .map((chunk) => {
        if (chunk.startsWith('<h2>')) {
          return `<section class="prose-section" data-reveal>${chunk}</section>`;
        }
        return `<div class="prose-opening">${chunk}</div>`;
      })
      .join('\n');
  };

  const html1 = String(await processor.process(md1));
  const html2 = md2 ? String(await processor.process(md2)) : '';

  return {
    part1Html: wrapSections(html1),
    part2Html: html2 ? wrapSections(html2) : '',
    wordCount: words + 180,
    readingMinutes,
  };
}
