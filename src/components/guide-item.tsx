import type { Guide } from "@/content/types";
import { CopyButton } from "./copy-button";

export function GuideItem({ guide: g }: { guide: Guide }) {
  return (
    <details className="py-1">
      <summary className="flex items-center gap-3 rounded-xl px-2 py-3 font-bold leading-snug transition-colors duration-200 hover:bg-mist">
        <span className="disclosure-icon grid size-6 shrink-0 place-items-center rounded-full bg-action-soft text-action">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
        {g.symptom}
      </summary>
      <div className="flex flex-col gap-4 pb-4 pl-11 pr-2">
        <p className="max-w-prose text-ink-muted">{g.cause}</p>
        <div>
          <h3 className="text-sm font-bold">먼저 확인할 것</h3>
          <ul className="mt-1 list-disc pl-5 text-sm leading-relaxed">
            {g.checkFirst.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold">AI 도구에 붙여넣기</h3>
            <CopyButton text={g.prompt} />
          </div>
          <pre className="mt-2 -rotate-[0.4deg] whitespace-pre-wrap rounded-xl bg-mark px-4 py-3 font-sans text-sm leading-relaxed shadow-clay-sm">
            {g.prompt}
          </pre>
        </div>
      </div>
    </details>
  );
}
