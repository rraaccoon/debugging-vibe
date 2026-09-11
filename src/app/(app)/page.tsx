import { CATEGORIES, GUIDES } from "@/content/guides";
import { CopyButton } from "@/components/copy-button";

const slug = (s: string) => s.replace(/\s+/g, "-");

export default function GuidePage() {
  return (
    <>
      <h1 className="text-2xl font-bold">막혔을 때, 증상부터 찾으세요</h1>
      <p className="mt-2 max-w-prose text-ink-muted">
        항목을 열면 원인, 먼저 확인할 것, 그리고 AI 도구에 붙여넣을 말이 있어요. [대괄호]는 내 상황으로 바꿔서
        붙이세요.
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {CATEGORIES.map((c) => (
          <a key={c} href={`#${slug(c)}`} className="rounded-sm border border-line bg-white px-3 py-1 hover:border-action">
            {c}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((category) => {
        const items = GUIDES.filter((g) => g.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} id={slug(category)} className="mt-10 scroll-mt-6">
            <h2 className="text-lg font-bold">{category}</h2>
            <div className="mt-3 divide-y divide-line border-y border-line">
              {items.map((g) => (
                <details key={g.id} className="py-3">
                  <summary className="font-bold leading-snug">{g.symptom}</summary>
                  <div className="mt-3 flex flex-col gap-4 pl-5">
                    <p className="max-w-prose text-ink-muted">{g.cause}</p>
                    <div>
                      <h3 className="text-sm font-bold">먼저 확인할 것</h3>
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {g.checkFirst.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold">AI 도구에 붙여넣기</h3>
                        <CopyButton text={g.prompt} />
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap rounded-md bg-mark px-4 py-3 font-sans text-sm leading-relaxed">
                        {g.prompt}
                      </pre>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
