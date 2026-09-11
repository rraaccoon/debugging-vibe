import type { Role } from "@/lib/db";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 강사에게는 "닉네임 (이름)", 학생에게는 닉네임만. 강사 글에는 (강사) */
export function authorLabel(
  a: { author: string; authorRealName: string | null; authorRole: Role },
  viewerRole: Role | undefined,
): string {
  if (a.authorRole === "instructor") return `${a.author} (강사)`;
  if (viewerRole === "instructor" && a.authorRealName) return `${a.author} (${a.authorRealName})`;
  return a.author;
}
