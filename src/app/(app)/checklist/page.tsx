import type { Metadata } from "next";
import { CHECKLISTS } from "@/content/checklists";

export const metadata: Metadata = { title: "체크리스트" };

export default function ChecklistPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">하기 전에 한 번 보세요</h1>
      <p className="mt-2 max-w-prose text-ink-muted">
        문제는 생기기 전에 막는 게 제일 빨라요. 체크는 이 화면에서만 남고 새로고침하면 비워져요.
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {CHECKLISTS.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="rounded-sm border border-line bg-white px-3 py-1 hover:border-action">
            {c.when}
          </a>
        ))}
      </nav>

      {CHECKLISTS.map((c) => (
        <section key={c.id} id={c.id} className="mt-10 scroll-mt-6">
          <h2 className="text-lg font-bold">{c.when}</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {c.items.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-3 py-3">
                  <input type="checkbox" className="mt-1 size-4 accent-action" />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
