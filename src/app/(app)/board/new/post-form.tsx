"use client";

import { useActionState } from "react";
import { createPost } from "@/lib/actions";
import { MODULES, type ModuleSlug } from "@/content/modules";
import { BUTTON, CHIP, INPUT } from "@/components/ui";
import { PasteImages } from "@/components/paste-images";

const FIELDS = [
  { name: "what_doing", label: "무엇을 하다가", hint: "어느 화면에서 무엇을 하려고 했나요" },
  { name: "when_happened", label: "언제부터", hint: "무엇을 바꾼 뒤부터 그런가요, 처음부터인가요" },
  { name: "how_did", label: "어떻게 했나", hint: "AI에게 시킨 말, 누른 순서" },
  { name: "expected", label: "예상 값", hint: "무엇이 나와야 했나요" },
  { name: "actual", label: "실제 값", hint: "실제로 보인 것. 에러 문구는 그대로 붙여넣기" },
];

export function PostForm({ defaultModule }: { defaultModule: ModuleSlug }) {
  const [state, action, pending] = useActionState(createPost, undefined);
  return (
    <form action={action} className="mt-8 flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 shadow-clay sm:p-6">
      <fieldset className="flex flex-col gap-1 text-sm font-bold">
        <legend>어느 모듈에서 났나요</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {MODULES.map((m) => (
            <label key={m.slug} className="cursor-pointer">
              <input type="radio" name="module" value={m.slug} defaultChecked={m.slug === defaultModule} className="peer sr-only" />
              <span
                className={`${CHIP} inline-block font-normal peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-checked:hover:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-action/15`}
              >
                {m.short} {m.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1 text-sm font-bold">
        어디가 타나요? 한 줄로
        <input
          name="title"
          required
          maxLength={80}
          placeholder="예: 저장 버튼을 누르면 아무 일도 안 일어나요"
          className={INPUT}
        />
      </label>
      {FIELDS.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-sm font-bold">
          {f.label}
          <span className="font-normal text-ink-muted">{f.hint}</span>
          <textarea name={f.name} required rows={f.name === "actual" ? 5 : 2} className={INPUT} />
        </label>
      ))}
      <PasteImages />
      {state?.error && (
        <p key={state.error} role="alert" className="animate-shake rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${BUTTON} self-start`}>
        {pending ? "신고 중" : "신고하기"}
      </button>
    </form>
  );
}
