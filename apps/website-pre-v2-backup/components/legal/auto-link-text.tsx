import { Fragment, type ReactNode } from "react";

const URL_RE = /(https?:\/\/[^\s]+)/g;
const EMAIL_RE = /[\w.+-]+@[\w.-]+\.\w+/g;

const linkClass =
  "break-all font-medium text-[var(--color-primary)] underline-offset-2 hover:underline";

function segmentEmails(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(EMAIL_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      out.push(text.slice(last, match.index));
    }
    out.push(
      <a key={`${keyBase}-${match.index}`} href={`mailto:${match[0]}`} className={linkClass}>
        {match[0]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    out.push(text.slice(last));
  }
  if (out.length === 0) {
    out.push(text);
  }
  return out;
}

function linkUrlsAndEmails(line: string, lineKey: number): ReactNode {
  const segments = line.split(URL_RE);
  return segments.map((seg, i) => {
    if (seg.startsWith("http://") || seg.startsWith("https://")) {
      return (
        <a
          key={`${lineKey}-u${i}`}
          href={seg}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {seg}
        </a>
      );
    }
    return <Fragment key={`${lineKey}-t${i}`}>{segmentEmails(seg, `${lineKey}-${i}`)}</Fragment>;
  });
}

export function AutoLinkText({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  return (
    <div className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-base">
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? "\n" : null}
          {linkUrlsAndEmails(line, i)}
        </Fragment>
      ))}
    </div>
  );
}
