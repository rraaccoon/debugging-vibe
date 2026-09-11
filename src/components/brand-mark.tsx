/** "119" 사이렌 타일. ripple 이면 처음 한 번만 물결이 퍼진다 */
export function BrandMark({ size = "sm", ripple = false }: { size?: "sm" | "lg"; ripple?: boolean }) {
  const large = size === "lg";
  const shape = large ? "size-24 rounded-3xl" : "size-8 rounded-lg";
  return (
    <span className={`relative grid place-items-center ${large ? "size-24" : "size-8"}`} aria-hidden="true">
      {ripple && (
        <>
          <span className={`absolute inset-0 ${shape} animate-ripple bg-siren/40`} />
          <span className={`absolute inset-0 ${shape} animate-ripple bg-siren/25 [animation-delay:220ms]`} />
        </>
      )}
      <span
        className={`relative grid place-items-center bg-siren font-display leading-none text-white shadow-clay-sm ${shape} ${large ? "text-4xl" : "text-[13px]"}`}
      >
        119
      </span>
    </span>
  );
}
