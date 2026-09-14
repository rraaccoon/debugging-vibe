"use client";

import { useEffect, useRef, useState } from "react";

/** lib/images.ts 의 MAX_IMAGES · MAX_IMAGE_BYTES 와 같게 (서버 모듈은 클라이언트에 가져올 수 없다) */
const MAX = 5;
const MAX_BYTES = 800 * 1024;

type Shot = { file: File; url: string };

/** 가로 2000px 까지만 두고 WebP 로 줄인다(안 되는 브라우저는 JPEG). 800KB 를 넘으면 화질을 낮춰 다시 */
async function shrink(file: File): Promise<File> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const encode = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q));
  let type = "image/webp";
  let blob = await encode(type, 0.85);
  if (blob?.type !== type) {
    type = "image/jpeg";
    blob = await encode(type, 0.85);
  }
  for (const q of [0.6, 0.4]) {
    if (blob && blob.size <= MAX_BYTES) break;
    blob = await encode(type, q);
  }
  if (!blob) throw new Error("이미지를 줄이지 못했어요");
  return new File([blob], type === "image/webp" ? "shot.webp" : "shot.jpg", { type });
}

/**
 * 붙여넣기(Ctrl+V)로 스크린샷을 폼에 싣는다. 파일 고르기 버튼은 두지 않는다(강사 결정).
 * 숨은 file input 에 넣어 두면 폼 제출에 같이 실린다. 제출이 끝나면 React 가 form.reset() 을 부르니 그때 비운다.
 */
export function PasteImages() {
  const input = useRef<HTMLInputElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);

  // 페이지 어디서 붙여넣어도 받는다. 텍스트 붙여넣기는 건드리지 않고 이미지만 가로챈다
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) return;
      e.preventDefault();
      const shrunk = (await Promise.all(files.map((f) => shrink(f).catch(() => null)))).filter((f): f is File => f !== null);
      setShots((prev) => {
        const room = shrunk.slice(0, Math.max(0, MAX - prev.length));
        return [...prev, ...room.map((file) => ({ file, url: URL.createObjectURL(file) }))];
      });
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, []);

  useEffect(() => {
    const el = input.current!;
    const dt = new DataTransfer();
    for (const s of shots) dt.items.add(s.file);
    el.files = dt.files;
    const clear = () =>
      setShots((prev) => {
        prev.forEach((s) => URL.revokeObjectURL(s.url));
        return [];
      });
    el.form?.addEventListener("reset", clear);
    return () => el.form?.removeEventListener("reset", clear);
  }, [shots]);

  const remove = (i: number) =>
    setShots((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, j) => j !== i);
    });

  return (
    <div className="flex flex-col gap-2 text-sm">
      <input ref={input} type="file" name="images" accept="image/*" multiple hidden />
      {shots.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {shots.map((s, i) => (
            <li key={s.url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: 주소라 next/image 를 못 쓴다 */}
              <img src={s.url} alt={`스크린샷 ${i + 1}`} className="h-24 rounded-xl border border-line object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="이 스크린샷 빼기"
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-white shadow-clay-sm"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-ink-muted">
        {shots.length >= MAX
          ? `스크린샷은 ${MAX}장까지 붙일 수 있어요.`
          : "화면을 캡처한 뒤 이 페이지에서 붙여넣기(Ctrl+V · ⌘V)하면 스크린샷이 함께 올라가요."}
      </p>
    </div>
  );
}
