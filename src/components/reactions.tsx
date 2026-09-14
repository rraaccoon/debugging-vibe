"use client";

import { useId, useOptimistic, useRef, useState, useTransition } from "react";
import { toggleReaction } from "@/lib/actions";
import type { Reaction } from "@/lib/db";
import { isEmoji } from "@/lib/emoji";
import { BUTTON, INPUT } from "@/components/ui";

/** 선택창에 바로 보이는 것들 — 앞의 다섯 개는 상태용(해결 됨 · 해결 중 · 확인 중 · 도움 필요 · 도움 됨) */
const QUICK = [
  "✅", "🔄", "👀", "🙏", "👍", "❤️", "🔥", "🎉",
  "😂", "😅", "😢", "🤔", "💡", "⭐", "🚀", "🐛",
  "🛠️", "⚠️", "❓", "❗", "💯", "👏", "🙌", "🤝",
  "⏳", "📌", "📝", "🔍", "💬", "🧠", "😎", "🥲",
  "😭", "🤯", "🙃", "🫡", "👌", "✨", "🎯", "🏁",
];
const POP_WIDTH = 288; // w-72

const CHIP =
  "rounded-full border px-2.5 py-0.5 text-sm transition-all duration-200 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 active:scale-95";

type Viewer = { id: number; name: string };

/** 서버 답을 기다리지 않고 화면에서 먼저 토글한다. 서버가 다시 그려 주면 그 값으로 바뀐다 */
function toggleLocally(state: Reaction[], emoji: string, viewer: Viewer): Reaction[] {
  const found = state.find((r) => r.emoji === emoji);
  if (!found) return [...state, { emoji, users: [viewer] }];
  const mine = found.users.some((u) => u.id === viewer.id);
  const users = mine ? found.users.filter((u) => u.id !== viewer.id) : [...found.users, viewer];
  return users.length === 0 ? state.filter((r) => r.emoji !== emoji) : state.map((r) => (r.emoji === emoji ? { ...r, users } : r));
}

/**
 * Slack 식 이모지 반응. 누르면 달리고 다시 누르면 빠진다. 같은 이모지는 개수로 묶이고 마우스를 올리면 누가 눌렀는지 보인다.
 * 선택창은 브라우저의 popover(바깥을 누르면 닫힘). 그리드에 없는 이모지는 칸에 붙여넣는다(운영체제 이모지 자판).
 */
export function Reactions({
  postId,
  answerId,
  reactions,
  viewer,
}: {
  postId: number;
  answerId?: number;
  reactions: Reaction[];
  viewer: Viewer;
}) {
  const popId = useId();
  const pop = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [, start] = useTransition();
  const [shown, toggleShown] = useOptimistic(reactions, (state: Reaction[], emoji: string) => toggleLocally(state, emoji, viewer));
  const [error, setError] = useState<string | null>(null);

  const react = (emoji: string): boolean => {
    if (!isEmoji(emoji)) {
      setError("이모지 하나만 넣어 주세요");
      return false;
    }
    setError(null);
    pop.current?.hidePopover();
    start(async () => {
      toggleShown(emoji);
      await toggleReaction({ postId, answerId, emoji });
    });
    return true;
  };

  /** 직접 넣은 이모지 — 됐으면 칸을 비운다 */
  const pickTyped = () => {
    const el = field.current;
    if (el && react(el.value.trim())) el.value = "";
  };

  // popover 는 기본으로 화면 한가운데 뜨므로, 열기 전에 버튼 아래로 옮겨 둔다 (화면 밖으로 나가지 않게 자른다)
  const place = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const el = pop.current;
    if (!el) return;
    el.style.inset = "auto";
    el.style.top = `${Math.max(8, Math.min(r.bottom + 6, window.innerHeight - 340))}px`;
    el.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - POP_WIDTH - 8))}px`;
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {shown.map((r) => {
        const mine = r.users.some((u) => u.id === viewer.id);
        return (
          <button
            key={r.emoji}
            type="button"
            onClick={() => react(r.emoji)}
            title={r.users.map((u) => u.name).join(", ")}
            aria-pressed={mine}
            className={`${CHIP} ${mine ? "border-action bg-action-soft" : "border-line bg-white hover:border-ink-faint"}`}
          >
            {r.emoji} <span className={`text-xs font-bold ${mine ? "text-action" : "text-ink-muted"}`}>{r.users.length}</span>
          </button>
        );
      })}
      <button
        type="button"
        popoverTarget={popId}
        onClick={place}
        aria-label="이모지 남기기"
        className={`${CHIP} border-dashed border-line text-ink-muted hover:border-action hover:text-action`}
      >
        😀<span className="text-xs font-bold">+</span>
      </button>
      <div id={popId} ref={pop} popover="auto" className="m-0 w-72 rounded-2xl border border-line bg-white p-3 shadow-clay">
        <div className="grid grid-cols-8 gap-0.5 text-xl leading-none">
          {QUICK.map((e) => (
            <button key={e} type="button" onClick={() => react(e)} className="rounded-lg p-1 transition-colors hover:bg-mist">
              {e}
            </button>
          ))}
        </div>
        {/* form 을 쓰지 않는다 — 제출이 페이지 이동으로 새지 않게 Enter 와 버튼만 직접 받는다 */}
        <div className="mt-3 flex gap-2">
          <input
            ref={field}
            name="emoji"
            placeholder="다른 이모지 붙여넣기"
            aria-label="다른 이모지"
            className={`${INPUT} py-1.5 text-sm`}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              pickTyped();
            }}
          />
          <button type="button" onClick={pickTyped} className={`${BUTTON} px-3.5 py-1.5`}>
            남기기
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-muted">이모지 자판: Windows ⊞ + . · Mac ⌃ ⌘ Space</p>
        {error && (
          <p role="alert" className="mt-1 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
