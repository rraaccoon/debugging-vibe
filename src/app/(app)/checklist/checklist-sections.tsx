"use client";

import { useState } from "react";
import type { Checklist } from "@/content/types";
import { stagger } from "@/components/ui";

export function ChecklistSections({ lists }: { lists: Checklist[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <>
      {lists.map((c, i) => {
        const done = c.items.filter((item) => checked[`${c.id}:${item}`]).length;
        const all = done === c.items.length;
        return (
          <section key={c.id} id={c.id} style={stagger(3 + i)} className="mt-10 scroll-mt-20">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="font-display text-xl">{c.when}</h2>
              <span className="text-sm tabular-nums text-ink-muted">
                {done}/{c.items.length}
              </span>
              {all && (
                <span className="animate-pop rounded-full bg-action px-2.5 py-0.5 text-xs font-bold text-white">
                  점검 완료
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div
                className="h-full origin-left rounded-full bg-action transition-transform duration-500 ease-out-expo"
                style={{ transform: `scaleX(${done / c.items.length})` }}
              />
            </div>
            <ul className="mt-2 divide-y divide-line">
              {c.items.map((item) => {
                const key = `${c.id}:${item}`;
                return (
                  <li key={item}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-mist">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!checked[key]}
                        onChange={(e) => setChecked((prev) => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 border-line bg-white transition-all duration-200 ease-spring peer-checked:border-action peer-checked:bg-action peer-focus-visible:ring-2 peer-focus-visible:ring-action/50 [&>svg]:scale-0 [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-spring peer-checked:[&>svg]:scale-100"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12">
                          <path d="M2 6.5l2.5 2.5 5-5.5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="strike peer-checked:text-ink-faint peer-checked:[background-size:100%_1.5px]">{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
