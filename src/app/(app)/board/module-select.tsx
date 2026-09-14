"use client";

import { useRouter } from "next/navigation";
import { MODULES } from "@/content/modules";

/** 목록을 어느 모듈로 걸러 볼지. 모듈 이름 길이에 폭이 흔들리지 않게 고정 폭 드롭다운 */
export function ModuleSelect({ value }: { value: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-bold text-ink-muted">모듈</span>
      <select
        key={value}
        defaultValue={value}
        aria-label="모듈로 걸러 보기"
        onChange={(e) => router.push(`/board?m=${e.target.value}`)}
        className="w-64 max-w-full cursor-pointer rounded-xl border-2 border-line bg-white px-3 py-2 text-sm transition-[border-color,box-shadow] duration-200 focus:border-action focus:outline-none focus:ring-4 focus:ring-action/15"
      >
        <option value="all">모든 모듈</option>
        {MODULES.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.short} {m.name}
          </option>
        ))}
      </select>
    </label>
  );
}
