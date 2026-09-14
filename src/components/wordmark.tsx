/**
 * 사이트 이름 "디버그 119". 119 는 소방서 · 구급 번호처럼 사이렌색 굵은 숫자로 두고 밑에 소방차 줄무늬를 깐다.
 * 글자 크기는 부모(헤더 링크 · 로그인 h1)가 정한다. 부모에 .group 이 있으면 마우스를 올릴 때 줄무늬가 경광등처럼 흐른다.
 */
export function Wordmark() {
  return (
    <>
      디버그{" "}
      <span className="relative inline-block font-black tabular-nums tracking-tight text-siren">
        119
        <span aria-hidden="true" className="siren-stripe absolute inset-x-0 -bottom-[0.06em] h-[0.12em] rounded-full" />
      </span>
    </>
  );
}
