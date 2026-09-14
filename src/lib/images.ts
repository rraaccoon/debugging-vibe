import type { ImageInput } from "@/lib/db";

/** 질문 · 답 하나에 붙일 수 있는 스크린샷 수. components/paste-images.tsx 의 MAX 와 같게 */
export const MAX_IMAGES = 5;
/** 한 장 한도. 5장을 다 붙여도 Vercel 요청 본문 한도(4.5MB) 안에 들게 */
export const MAX_IMAGE_BYTES = 800 * 1024;
/** svg 는 스크립트가 들어갈 수 있어 받지 않는다 */
const MIMES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

/** 폼의 images 칸에서 쓸 수 있는 것만 골라 Buffer 로. 빈 file input · 이미지가 아닌 것 · 너무 큰 것은 조용히 버린다 */
export async function pickImages(formData: FormData): Promise<ImageInput[]> {
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0 && v.size <= MAX_IMAGE_BYTES && MIMES.has(v.type))
    .slice(0, MAX_IMAGES);
  return Promise.all(files.map(async (f) => ({ mime: f.type, data: Buffer.from(await f.arrayBuffer()) })));
}
