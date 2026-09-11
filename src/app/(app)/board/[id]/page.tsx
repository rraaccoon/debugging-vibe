import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/db";
import { addAnswer } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { BUTTON, INPUT } from "@/components/ui";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  const data = Number.isInteger(postId) ? await getPost(postId) : null;
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
    <>
      <Link href="/board" className="text-sm text-ink-muted hover:text-ink">
        ← 질문 게시판
      </Link>
      <h1 className="mt-3 text-2xl font-bold">{post.title}</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {post.author}
        {post.authorRole === "instructor" && " (강사)"}, {formatDate(post.createdAt)}
      </p>

      <dl className="mt-6 divide-y divide-line border-y border-line">
        {fields.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
            <dt className="text-sm font-bold text-ink-muted">{label}</dt>
            <dd className="whitespace-pre-wrap">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-lg font-bold">답 {answers.length}</h2>
        {answers.length === 0 ? (
          <p className="mt-3 text-ink-muted">아직 답이 없어요.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {answers.map((a) => (
              <li
                key={a.id}
                className={`rounded-md px-4 py-3 ${a.authorRole === "instructor" ? "bg-action-soft" : "border border-line bg-white"}`}
              >
                <p className="text-sm font-bold">
                  {a.author}
                  {a.authorRole === "instructor" && " (강사)"}{" "}
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
    </>
  );
}
