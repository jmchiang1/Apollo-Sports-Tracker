import { Fragment, type ReactNode } from "react";

// Match URLs and US phone numbers so we can turn them into links.
const TOKEN_RE =
  /(?<url>https?:\/\/[^\s)]+)|(?<phone>\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4})/g;

const linkClass =
  "font-medium text-accent-strong underline decoration-accent/40 underline-offset-2 transition hover:decoration-accent";

/** Render text with URLs as links and phone numbers as tel: links. */
export function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of text.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));

    const raw = m[0];
    if (m.groups?.url) {
      const url = raw.replace(/[.,;:]+$/, ""); // drop trailing sentence punctuation
      nodes.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          {url}
        </a>,
      );
      last = idx + url.length;
    } else {
      const tel = raw.replace(/[^\d]/g, "");
      nodes.push(
        <a key={key++} href={`tel:${tel}`} className={linkClass}>
          {raw}
        </a>,
      );
      last = idx + raw.length;
    }
  }

  if (last < text.length) nodes.push(text.slice(last));

  return <span className={className}>{nodes.map((n, i) => (
    <Fragment key={i}>{n}</Fragment>
  ))}</span>;
}
