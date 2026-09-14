import { MODULES, type ModuleSlug } from "@/content/modules";
import { setModule } from "@/lib/actions";

/** 헤더 둘째 줄 — 모듈을 고르면 쿠키에 남고 네 화면이 그 모듈로 걸러진다 */
export function ModuleTabs({ current }: { current: ModuleSlug }) {
  return (
    <div role="group" aria-label="수업 모듈" className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 pb-2.5">
      {MODULES.map((m) => {
        const on = m.slug === current;
        return (
          <form key={m.slug} action={setModule}>
            <input type="hidden" name="module" value={m.slug} />
            <button
              type="submit"
              aria-current={on ? "true" : undefined}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ease-out-expo active:scale-95 ${
                on ? "bg-ink text-white shadow-clay-sm" : "border border-line bg-white text-ink-muted hover:-translate-y-0.5 hover:border-ink-faint hover:text-ink"
              }`}
            >
              <span className={on ? "opacity-60" : "text-ink-muted"}>{m.short}</span> {m.name}
            </button>
          </form>
        );
      })}
    </div>
  );
}
