"use client";

import { useState } from "react";
import { BUTTON } from "./ui";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={BUTTON}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "복사했어요" : "복사"}
    </button>
  );
}
