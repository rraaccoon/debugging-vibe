"use client";

import { useState } from "react";
import { BUTTON } from "./ui";

export function CopyButton({ text }: { text: string }) {
  const [copiedAt, setCopiedAt] = useState(0);
  const copied = copiedAt > 0;
  return (
    <button
      type="button"
      className={BUTTON}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopiedAt(Date.now());
        setTimeout(() => setCopiedAt(0), 1500);
      }}
    >
      {copied ? (
        <svg key={copiedAt} className="animate-pop" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9.5 4.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
      {copied ? "복사했어요" : "복사"}
    </button>
  );
}
