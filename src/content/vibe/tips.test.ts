/** node src/content/vibe/tips.test.ts — 갱신 스크립트가 tips.ts 를 계속 읽고 고칠 수 있는지 확인한다 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ECOSYSTEM, formatStars } from "./tips.ts";
import { applyStars, REPO_RE } from "../../../scripts/update-stars.ts";

const src = readFileSync(new URL("./tips.ts", import.meta.url), "utf8");
const matched = [...src.matchAll(REPO_RE)].map((m) => m[2]);
const listed = ECOSYSTEM.flatMap((g) => g.items.map((i) => i.name));

// 스크립트의 정규식이 목록의 모든 저장소를 집어야 한다 — 못 집으면 그 항목만 조용히 안 바뀐다
assert.deepEqual([...matched].sort(), [...listed].sort(), "update-stars.ts 가 못 집는 항목이 있다");
assert.ok(listed.length > 0);
assert.ok(ECOSYSTEM.every((g) => g.items.every((i) => Number.isInteger(i.stars) && i.stars >= 0)));

// 파일을 실제로 고치는 부분 — 숫자와 기준일만 바뀌고 설명은 그대로여야 한다
const sample = applyStars(src, new Map([[listed[0], 12345]]), "2099-12-31");
assert.ok(sample.includes(`name: "${listed[0]}", stars: 12345`), "별 수가 안 바뀐다");
assert.ok(sample.includes('export const STARS_UPDATED = "2099-12-31";'), "기준일이 안 바뀐다");
assert.ok(sample.includes(ECOSYSTEM[0].items[0].what), "설명 문장이 훼손됐다");
assert.equal(applyStars(src, new Map(), "2026-09-14"), src, "바꿀 게 없으면 파일이 그대로여야 한다");

assert.equal(formatStars(499), "499");
assert.equal(formatStars(999), "999");
assert.equal(formatStars(1000), "1.0k");
assert.equal(formatStars(39629), "39.6k");
assert.equal(formatStars(100000), "100k");
assert.equal(formatStars(286182), "286k");

console.log("tips.test.ts 통과");
