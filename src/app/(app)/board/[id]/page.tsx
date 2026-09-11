import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/db";
import { getUser } from "@/lib/session";
import { addAnswer } from "@/lib/actions";
import { authorLabel, formatDate } from "@/lib/format";
import { PageTransition } from "@/components/page-transition";
import { BUTTON, INPUT, stagger } from "@/components/ui";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  const [data, viewer] = await Promise.all([Number.isInteger(postId) ? getPost(postId) : null, getUser()]);
  if (!data) notFound();
  const { post, answers } = data;

  const fields = [
    ["무엇을 하다가", post.whatDoing],
    ["언제부터", post.whenHappened],
    ["어떻게 했나", post.howDid],
    ["예상 값", post.expected],
    ["실제 값", post.actual],
  ];

  return (
    <PageTransition>
      <div className="stagger">
        <Link
          href="/board"
          transitionTypes={["nav-back"]}
          style={stagger(0)}
          className="inline-block text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← 질문 게시판
        </Link>
        <h1 style={stagger(1)} className="mt-3 font-display text-3xl leading-tight">
          {post.title}
        </h1>
        <p style={stagger(1)} className="mt-2 text-sm text-ink-muted">
          {authorLabel(post, viewer?.role)}, {formatDate(post.createdAt)}
        </p>

        <dl style={stagger(2)} className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white px-5 shadow-clay-sm">
          {fields.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3.5 sm:grid-cols-[8rem_1fr]">
              <dt className="text-sm font-bold text-ink-muted">{label}</dt>
              <dd className="whitespace-pre-wrap">{value}</dd>
            </div>
          ))}
        </dl>

        <section style={stagger(3)} className="mt-10">
          <h2 className="font-display text-xl">답 {answers.length}</h2>
          {answers.length === 0 ? (
            <p className="mt-3 text-ink-muted">아직 답이 없어요. 첫 답을 남겨 주세요.</p>
          ) : (
            <ul className="stagger mt-3 flex flex-col gap-3">
              {answers.map((a, i) => (
                <li
                  key={a.id}
                  style={stagger(i)}
                  className={`rounded-2xl px-4 py-3.5 ${a.authorRole === "instructor" ? "bg-action-soft" : "border border-line bg-white shadow-clay-sm"}`}
                >
                  <p className="text-sm font-bold">
                    {authorLabel(a, viewer?.role)}{" "}
                    <span className="font-normal text-ink-muted">{formatDate(a.createdAt)}</span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{a.body}</p>
                </li>
              ))}
            </ul>
          )}

          <form action={addAnswer} className="mt-6 flex flex-col gap-3">
            <input type="hidden" name="post_id" value={post.id} />
            <label className="flex flex-col gap-1 text-sm font-bold">
              답 남기기
              <textarea
                name="body"
                required
                rows={4}
                placeholder="원인이 짐작되면 그것부터, 확실하지 않으면 확인해 볼 것을 적어 주세요"
                className={INPUT}
              />
            </label>
            <button type="submit" className={`${BUTTON} self-start`}>
              답 남기기
            </button>
          </form>
        </section>
      </div>
    </PageTransition>
  );
}
