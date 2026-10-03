import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|\*([^*]+?)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) parts.push(<strong key={`${match.index}-b`}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={`${match.index}-i`}>{match[3]}</em>);
    else if (match[4])
      parts.push(
        <code
          key={`${match.index}-c`}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        >
          {match[4]}
        </code>,
      );
    else if (match[5] && match[6]) {
      parts.push(
        <a
          key={`${match.index}-a`}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {match[5]}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function MarkdownContent({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={`code-${i}`} className="overflow-x-auto rounded-xl bg-muted p-3 text-xs">
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    if (
      /^\|.*\|$/.test(line) &&
      i + 1 < lines.length &&
      /^\|?\s*:?-{3,}/.test(lines[i + 1].trim())
    ) {
      const headers = line
        .split("|")
        .slice(1, -1)
        .map((v) => v.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        rows.push(
          lines[i++]
            .trim()
            .split("|")
            .slice(1, -1)
            .map((v) => v.trim()),
        );
      }
      blocks.push(
        <div key={`table-${i}`} className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {headers.map((h, n) => (
                  <th key={n} className="border-b border-border px-2 py-2 font-semibold">
                    {inline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {headers.map((_, c) => (
                    <td key={c} className="border-b border-border/60 px-2 py-2">
                      {inline(row[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const Heading = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      blocks.push(
        <Heading key={`heading-${i}`} className="font-bold">
          {inline(line.replace(/^#{1,3}\s+/, ""))}
        </Heading>,
      );
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];
      while (
        i < lines.length &&
        (ordered ? /^\d+\.\s+/.test(lines[i].trim()) : /^[-*]\s+/.test(lines[i].trim()))
      ) {
        items.push(lines[i++].trim().replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""));
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List
          key={`list-${i}`}
          className={`${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5`}
        >
          {items.map((item, n) => (
            <li key={n}>{inline(item)}</li>
          ))}
        </List>,
      );
      continue;
    }
    const paragraph: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,3}\s|^[-*]\s+|^\d+\.\s+|^```|^\|.*\|$/.test(lines[i].trim())
    )
      paragraph.push(lines[i++].trim());
    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {inline(paragraph.join(" "))}
      </p>,
    );
  }
  return <div className={`space-y-3 ${className}`}>{blocks}</div>;
}
