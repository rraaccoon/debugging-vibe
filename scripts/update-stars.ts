/**
 * src/content/vibe/tips.ts 의 `stars:` 숫자를 GitHub 에서 다시 읽어 채운다.
 * 바꾸는 것은 숫자와 기준일뿐이다 — 설명 문장과 목록은 강사가 손으로 고친다.
 * 매일 08:30 (한국 시간) 에 .github/workflows/update-stars.yml 이 돌린다.
 *   실행: npm run stars:update
 */
import { readFileSync, writeFileSync } from "node:fs";

/** tips.ts 안의 한 줄에서 저장소 이름과 별 수를 집는다 */
export const REPO_RE = /(name: "([\w.\-]+\/[\w.\-]+)", stars: )(\d+)/g;

const FILE = new URL("../src/content/vibe/tips.ts", import.meta.url);

/** 새 별 수와 기준일을 적어 넣는다. 네트워크와 분리해 두어야 시험할 수 있다 */
export function applyStars(src: string, fresh: Map<string, number>, today: string) {
  return src
    .replace(REPO_RE, (whole, head, repo: string) => (fresh.has(repo) ? `${head}${fresh.get(repo)}` : whole))
    .replace(/(export const STARS_UPDATED = ")[\d-]+(")/, `$1${today}$2`);
}

async function main() {
  const before = readFileSync(FILE, "utf8");
  const repos = [...new Set([...before.matchAll(REPO_RE)].map((m) => m[2]))];
  if (repos.length === 0) throw new Error("tips.ts 에서 저장소를 못 찾았다 — 줄 형식이 바뀌었는지 확인할 것");

  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "debug119-update-stars",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const fresh = new Map<string, number>();
  const failed: string[] = [];

  for (const repo of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { stargazers_count } = (await res.json()) as { stargazers_count?: number };
      if (typeof stargazers_count !== "number") throw new Error("별 수가 없다");
      fresh.set(repo, stargazers_count);
    } catch (e) {
      failed.push(`${repo} — ${(e as Error).message}`);
    }
  }

  // 절반 넘게 실패하면 반쪽짜리 갱신을 남기지 않는다
  if (failed.length * 2 > repos.length) {
    console.error(failed.join("\n"));
    throw new Error(`${repos.length}개 중 ${failed.length}개 실패 — 아무것도 안 고쳤다`);
  }
  if (failed.length) console.warn("건너뜀:\n" + failed.join("\n"));

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10); // 한국 시간
  const after = applyStars(before, fresh, today);

  if (after === before) {
    console.log("변경 없음");
    return;
  }
  writeFileSync(FILE, after);
  console.log(`갱신함 — 저장소 ${repos.length}개, 기준일 ${today}`);
}

if (process.argv[1]?.endsWith("update-stars.ts")) await main();
