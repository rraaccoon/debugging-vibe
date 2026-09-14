/**
 * RGI 이모지 하나인지 — 피부색 · 가족 같은 ZWJ 조합 · 국기 · ❤️ 포함. 글자 · 숫자 · 이모지 두 개 · 빈 문자열은 아니다.
 * v 플래그를 모르는 옛 브라우저에서는 대강만 본다. 서버가 다시 검사하므로 느슨해도 된다.
 */
const ONE_EMOJI = (() => {
  try {
    return new RegExp("^\\p{RGI_Emoji}$", "v");
  } catch {
    return new RegExp("^\\p{Extended_Pictographic}(\\uFE0F|\\p{Emoji_Modifier})?$", "u");
  }
})();

export const isEmoji = (s: string): boolean => ONE_EMOJI.test(s);
