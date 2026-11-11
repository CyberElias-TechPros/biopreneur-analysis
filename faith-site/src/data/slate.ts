import fs from 'node:fs';
import path from 'node:path';

export interface SlateMonth {
  monthNumber: number;
  monthName: string;
  arcTitle: string;
  subtitle: string;
  anchors: string;
  totalDays: number;
  topics: { dayOfMonth: number; globalDay: number; title: string }[];
}

let cachedMonths: SlateMonth[] | null = null;

export function getYearSlate(): SlateMonth[] {
  if (cachedMonths) return cachedMonths;

  const slatePath = path.resolve(process.cwd(), '..', 'TOPICS_365.md');
  const raw = fs.readFileSync(slatePath, 'utf-8');
  const blocks = raw.split(/^## MONTH /m).slice(1);

  let runningDay = 0;
  const months: SlateMonth[] = [];

  for (const block of blocks) {
    const cleanBlock = block.split('\n---\n')[0];
    const lines = cleanBlock.split('\n');
    const head = lines[0] || '';
    const headMatch = head.match(/^(\d+)\s+—\s+(\w+)\s+·\s+(.+)\s+\((\d+)\)/);
    if (!headMatch) continue;

    const monthNumber = Number(headMatch[1]);
    const monthName = headMatch[2];
    const arcTitle = headMatch[3].trim();
    const totalDays = Number(headMatch[4]);

    const subMatch = cleanBlock.match(/^\*(.+)\*$/m);
    const anchorMatch = cleanBlock.match(/^Anchor passages:\s*(.+)$/m);

    const topics: { dayOfMonth: number; globalDay: number; title: string }[] = [];
    for (const line of lines.slice(1)) {
      const m = line.match(/^(\d+)\.\s+(.+)$/);
      if (m) {
        runningDay += 1;
        topics.push({
          dayOfMonth: Number(m[1]),
          globalDay: runningDay,
          title: m[2].trim(),
        });
      }
    }

    months.push({
      monthNumber,
      monthName,
      arcTitle,
      subtitle: subMatch ? subMatch[1].trim() : '',
      anchors: anchorMatch ? anchorMatch[1].trim() : '',
      totalDays,
      topics,
    });
  }

  cachedMonths = months;
  return months;
}
