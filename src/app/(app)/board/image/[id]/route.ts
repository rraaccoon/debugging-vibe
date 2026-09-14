import { getImage } from "@/lib/db";
import { getUser } from "@/lib/session";

/** 질문 · 답에 붙인 스크린샷. 로그인한 사람만 본다 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getUser())) return new Response(null, { status: 401 });
  const id = Number((await params).id);
  const img = Number.isInteger(id) ? await getImage(id) : null;
  if (!img) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
