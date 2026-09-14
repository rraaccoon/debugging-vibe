/** 실행: node src/lib/emoji.test.ts */
import assert from "node:assert/strict";
import { isEmoji } from "./emoji.ts";

for (const ok of ["✅", "🔄", "👍🏽", "👨‍👩‍👧", "🇰🇷", "❤️", "1️⃣", "🫠"]) assert.ok(isEmoji(ok), `${ok} 는 이모지 하나`);
for (const no of ["", "a", "1", "✅✅", "✅ ", " ✅", "해결", "<script>", "✅a"]) {
  assert.ok(!isEmoji(no), `${JSON.stringify(no)} 는 이모지 하나가 아니다`);
}

console.log("emoji.test.ts 통과");
