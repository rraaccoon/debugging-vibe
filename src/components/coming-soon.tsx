import { moduleLabel } from "@/content/modules";

/** 모듈 내용이 아직 없을 때. 강사가 src/content/<모듈>/ 파일을 채우면 사라진다 */
export function ComingSoon({ module, what }: { module: string; what: string }) {
  return (
    <p className="mt-10 rounded-2xl border border-dashed border-line bg-white/60 px-5 py-10 text-center text-ink-muted">
      <span className="font-bold text-ink">{moduleLabel(module)}</span> 모듈의 {what}는 아직 준비 중이에요.
    </p>
  );
}
