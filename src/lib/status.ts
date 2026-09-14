/**
 * 출동 요청(질문)의 진압 상태. 이모지 반응에서 읽는다 — 별도 저장 없음.
 * 💧 · ✅ 가 하나라도 있으면 진압 완료, 🚒 · 🔄 가 있으면 출동 중, 아니면 불남.
 */
export type Status = "burning" | "working" | "done";

export const STATUS: Record<Status, { emoji: string; label: string; badge: string; bar: string }> = {
  burning: { emoji: "🔥", label: "불남", badge: "bg-flame-soft text-flame-deep", bar: "border-l-flame" },
  working: { emoji: "🚒", label: "출동 중", badge: "bg-mark text-ink", bar: "border-l-mark-deep" },
  done: { emoji: "💧", label: "진압 완료", badge: "bg-action-soft text-action-deep", bar: "border-l-action" },
};

export function statusOf(reactions: { emoji: string }[]): Status {
  const has = (...emojis: string[]) => reactions.some((r) => emojis.includes(r.emoji));
  if (has("💧", "✅")) return "done";
  if (has("🚒", "🔄")) return "working";
  return "burning";
}
