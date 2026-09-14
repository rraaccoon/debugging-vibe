/** 정보 공유 — AI 를 잘 쓰는 법. 강사가 이 파일을 직접 고친다. */

export type Tool = {
  id: string;
  title: string;
  /** 무엇인지 한두 문장 */
  what: string;
  /** 언제 쓰나 */
  when: string;
  /** 초보 팀이 조심할 것 */
  caution: string;
  /** 써 볼 프롬프트 (없으면 생략) */
  example?: string;
};

/** 도구보다 먼저 — 이 수업에서 정한 습관 */
export const BASICS = [
  "규칙 파일(CLAUDE.md) 하나에 스택 · 먼저 읽을 문서 · 하지 말 것을 적는다",
  "작게 시키고, 되면 바로 커밋한다 — 망가지면 돌아올 곳을 만든다",
  "\"고치기 전에 원인을 먼저 설명해\" 를 매번 붙인다",
  "AI 가 했다는 말은 화면과 파일로 직접 확인한다",
  "비밀 값(.env 안의 것)은 채팅에 붙이지 않는다",
];

export const TOOLS: Tool[] = [
  {
    id: "rules-file",
    title: "규칙 파일 (CLAUDE.md · AGENTS.md)",
    what: "프로젝트 폴더에 두는 글. AI 가 일을 시작할 때마다 먼저 읽는다. 우리 팀 규칙, 건드리면 안 되는 파일, 쓰는 스택을 적는다.",
    when: "첫날 만든다. 9일 프로젝트는 이것 하나로 대부분 충분하다.",
    caution: "길어질수록 AI 가 뒷부분을 놓친다. 20줄 안으로. 다른 프로젝트 것을 그대로 복사하지 않는다.",
    example: `이 프로젝트의 CLAUDE.md 를 만들어줘. 내용은 이것만:
- 스택: Next.js · Vercel · Neon
- 작업 전에 docs/PRD.md 를 읽는다. PRD 에 없는 요청은 만들기 전에 되묻는다
- 고치기 전에 원인을 먼저 설명한다
- .env 의 값은 절대 출력하거나 코드에 적지 않는다
20줄 안으로.`,
  },
  {
    id: "skill",
    title: "스킬 (Skill · 슬래시 명령)",
    what: "자주 하는 절차를 적어 둔 파일. /이름 으로 부르면 AI 가 그 절차대로 한다.",
    when: "같은 절차를 세 번 이상 시켰을 때. 예: 배포 전 점검.",
    caution: "절차가 우리 프로젝트와 안 맞으면 매번 틀린 순서로 한다. 남이 만든 스킬은 내용을 읽고 나서 쓴다.",
    example: `'배포 전 점검' 스킬을 만들어줘. 단계는 이 넷뿐:
1. npm run build 가 통과하는지
2. .env.local 의 환경변수 이름이 Vercel 에 다 있는지 (값은 출력 금지)
3. git status 가 깨끗한지
4. 결과를 한 줄씩 보고
이 밖의 일은 하지 마.`,
  },
  {
    id: "hooks",
    title: "훅 (Hooks)",
    what: "정해진 시점에 자동으로 도는 명령. 예: 파일을 고칠 때마다 검사 도구를 돌린다.",
    when: "AI 가 자꾸 잊는 확인을 강제하고 싶을 때. 9일 프로젝트에선 대개 필요 없다.",
    caution: "매번 실행되니 느려진다. 훅이 실패하면 아무것도 못 하는데, 코드 문제인지 훅 문제인지 구분이 안 된다. 문제가 생기면 훅부터 의심한다.",
    example: `지금 이 프로젝트에 설정된 hooks 를 보여주고, 각각 언제 무엇을 하는지 한 줄로 설명해줘. 만들거나 바꾸지는 마.`,
  },
  {
    id: "agents",
    title: "에이전트 (서브에이전트)",
    what: "역할을 나눈 AI. 예: 검토 담당, 화면 담당. 큰 일을 나눠 맡긴다.",
    when: "한 번에 보기 어려운 큰 작업이고, 결과를 사람이 읽고 확인할 수 있을 때만.",
    caution: "에이전트 여러 개가 같은 파일을 고치면 팀원 충돌과 똑같은 일이 난다. 결과를 안 읽고 믿으면 지어낸 것이 그대로 들어간다.",
    example: `이 변경을 검토 담당 에이전트에게 맡겨서, 내가 시킨 것 밖의 변경이 있는지만 찾게 해줘. 고치지는 말고 파일과 줄 목록만 보고해.`,
  },
  {
    id: "mcp",
    title: "MCP (외부 도구 연결)",
    what: "AI 에게 브라우저 · DB · 디자인 도구 같은 손을 달아 주는 연결.",
    when: "AI 가 직접 화면을 열어 눌러 보고 확인하게 하고 싶을 때 (Playwright).",
    caution: "연결마다 권한을 준다. 무엇을 할 수 있는지 모르는 연결은 켜지 않는다. 켜 둔 연결이 많을수록 AI 가 읽을 설명이 늘어 대화가 짧아진다.",
  },
];

/** 요즘 많이 쓰는 것들 — 이름과 하는 일만 */
export const POPULAR = [
  { name: "Claude Code", what: "터미널에서 프로젝트 전체를 다루는 AI. 규칙 파일 · 스킬 · 훅 · 서브에이전트 · MCP 가 여기 개념이다. 이 수업의 도구." },
  { name: "Cursor", what: "에디터 안에 AI 가 들어 있다. .cursor/rules 가 규칙 파일 역할." },
  { name: "GitHub Copilot", what: "에디터에서 코드를 자동 완성하고 채팅으로 묻는다." },
  { name: "Claude Design · v0", what: "말로 화면 시안을 만든다. 이 수업은 Claude Design 으로 화면을 그렸다." },
  { name: "Playwright MCP", what: "AI 가 브라우저를 열어 화면을 눌러 보고 확인한다. '다 됐다'는 말을 믿지 않아도 된다." },
  { name: "Context7 MCP", what: "라이브러리의 최신 문서를 AI 에게 읽힌다. AI 가 옛 버전 방식으로 코드를 쓰는 것을 줄인다." },
  { name: "AGENTS.md", what: "여러 AI 도구가 같이 읽는 규칙 파일. Next.js 는 개발 서버를 켜면 자동으로 만들어 준다." },
];

export const OVERUSE = {
  title: "많이 붙일수록 오히려 망하는 이유",
  intro:
    "도구를 하나 붙일 때마다 AI 가 매번 읽어야 할 것이 늘어납니다. 처음 하는 팀에게는 도구보다 습관이 훨씬 큽니다.",
  reasons: [
    "규칙 파일이 길어지면 AI 가 뒷부분을 놓친다 — 대화가 짧아지고 엉뚱해진다",
    "훅은 매번 돈다 — 느려지고, 실패하면 코드 문제인지 훅 문제인지 구분이 안 된다",
    "에이전트 여러 개가 같은 파일을 고치면 팀원 충돌과 똑같이 한쪽 작업이 사라진다",
    "남이 만든 스킬 · 규칙을 그대로 붙이면 우리 프로젝트와 다른 지시(다른 프레임워크, 다른 언어)가 섞인다",
    "도구가 많으면 문제가 생겼을 때 찾아봐야 할 곳이 그만큼 늘어난다",
  ],
  ruleOfThumb:
    "이 수업 기준: 규칙 파일 하나 + 작게 시키고 커밋 + \"고치기 전에 설명해\". 이 셋이면 9일 프로젝트는 충분합니다. 도구는 같은 일을 세 번 반복한 뒤에 하나만 붙이고, 붙인 뒤 문제가 생기면 그 도구부터 끕니다.",
  prompt: `지금 이 프로젝트에 설정된 규칙 파일 · 스킬 · 훅 · 에이전트 · MCP 를 목록으로 보여주고, 각각 언제 실행되는지 한 줄로 설명해줘.
최근 [문제]와 관련 있을 만한 것을 짚고, 그것만 끄고 다시 시도하는 방법을 알려줘. 끄기 전에 나한테 확인받아.`,
};

/* ─────────────────────────────────────────────────────────────
   실제로 많이 쓰이는 것 — 순위와 쓰는 법
   별 수는 2026-09-14 GitHub 기준. 숫자는 계속 변하니 순서만 참고한다.
   ───────────────────────────────────────────────────────────── */

/** 공식 문서 기준 — 넷 중 무엇을 언제 */
export const WHICH_ONE = [
  {
    kind: "스킬",
    use: "같은 지시를 또 붙여넣고 있을 때",
    how: "지금 이 대화 안에서 그대로 이어진다",
  },
  {
    kind: "서브에이전트",
    use: "결과만 필요하고 과정(로그 · 검색 결과)은 대화에 안 남기고 싶을 때",
    how: "따로 떨어진 대화에서 돌고 요약만 돌아온다",
  },
  {
    kind: "플러그인",
    use: "팀 전원이 같은 설정을 써야 할 때",
    how: "스킬 · 에이전트 · MCP · 훅 을 한 묶음으로 설치한다",
  },
  {
    kind: "MCP",
    use: "AI 가 브라우저 · DB · 깃허브를 직접 만져야 할 때",
    how: "바깥 프로그램에 연결한다. 이것 말고는 방법이 없다",
  },
];

export type EcoItem = {
  name: string;
  /** GitHub 별 수 — scripts/update-stars.ts 가 매일 다시 채운다. 손으로 고치지 않는다 */
  stars: number;
  /** Anthropic 공식 저장소인가 */
  official?: boolean;
  what: string;
};

export type EcoGroup = {
  id: string;
  title: string;
  /** 공식 문서의 한 줄 정의 */
  definition: string;
  /** 파일이 어디 있고 어떻게 만드나 */
  howTo: string;
  /** 처음이라면 이것 하나만 */
  firstPick: string;
  items: EcoItem[];
};

export const ECOSYSTEM: EcoGroup[] = [
  {
    id: "eco-skill",
    title: "스킬 (Agent Skills)",
    definition: "AI 에게 절차를 적어 준 파일. 공식 문서는 \"에이전트에 능력을 더하는 공개 표준\" 이라고 부른다.",
    howTo: `# 내 컴퓨터 전체에서 쓰기
~/.claude/skills/이름/SKILL.md

# 이 프로젝트에서만 쓰기 (팀과 같이 쓰려면 이쪽을 커밋)
.claude/skills/이름/SKILL.md

# 공식 19개 구경하기
github.com/anthropics/skills`,
    firstPick:
      "공식 저장소의 frontend-design 하나. 화면이 \"AI 가 만든 티\" 나는 것을 줄여 준다. 문서 다루는 docx · pdf · pptx · xlsx 네 개도 공식이라 믿을 만하다.",
    items: [
      { name: "obra/superpowers", stars: 286182, what: "스킬 + 일하는 방식(테스트 먼저 쓰기 · 차근차근 디버깅 · 계획 세우고 실행)을 묶어 놓았다. Claude Code 말고 Cursor · Copilot 에도 쓴다." },
      { name: "mattpocock/skills", stars: 261200, what: "현업 개발자 한 명이 실제로 쓰는 스킬 폴더를 그대로 공개한 것. 일반 개발 작업용." },
      { name: "anthropics/skills", stars: 176120, official: true, what: "Anthropic 공식 19개. frontend-design · canvas-design · docx · pdf · pptx · xlsx · webapp-testing · skill-creator · mcp-builder 등." },
      { name: "addyosmani/agent-skills", stars: 94000, what: "실무용 엔지니어링 스킬 모음." },
      { name: "ComposioHQ/awesome-claude-skills", stars: 75000, what: "스킬을 모아 놓은 목록. 뭐가 있는지 훑을 때." },
      { name: "VoltAgent/awesome-agent-skills", stars: 34300, what: "1000개 넘는 스킬 색인. Claude · Codex · Gemini · Cursor 것을 같이 모았다." },
    ],
  },
  {
    id: "eco-agent",
    title: "서브에이전트 (Subagents)",
    definition: "공식 문서: \"각자 자기 대화 창을 따로 가지고, 정해진 종류의 일만 하는 AI 조수\".",
    howTo: `# 이 프로젝트에서만
.claude/agents/이름.md

# 내 컴퓨터 전체
~/.claude/agents/이름.md

# 파일을 직접 쓰지 않아도 된다 — 이렇게 시키면 만들어 준다
"내 코드 변경만 검토하는 에이전트를 .claude/agents 에 만들어줘.
 고치지는 말고 파일과 줄 목록만 보고하게 해."`,
    firstPick:
      "code-reviewer 하나. 어느 목록을 봐도 1등이고, 설정에 10분이면 된다. 받기 전에 먼저 확인할 것 — Claude Code 에는 Explore · Plan · general-purpose 가 이미 기본으로 들어 있다.",
    items: [
      { name: "wshobson/agents", stars: 39629, what: "가장 큰 묶음. 에이전트 202개 · 스킬 183개 · 명령 105개. 필요한 것만 골라 쓴다." },
      { name: "VoltAgent/awesome-claude-code-subagents", stars: 25045, what: "154개를 10개 분야로 정리했다. 언어별 · 인프라 · 품질/보안 · 데이터 등." },
      { name: "contains-studio/agents", stars: 12400, what: "어느 스튜디오가 실제로 쓰던 것. 다만 2025년 7월 이후 멈춰 있다 — 참고만." },
      { name: "VoltAgent/awesome-codex-subagents", stars: 6200, what: "Codex 쪽 130여 개. 내용은 대체로 그대로 가져다 쓸 수 있다." },
      { name: "Doriandarko/maestro", stars: 4400, what: "에이전트 여러 개를 지휘하는 방식. 초보 팀에는 이르다." },
      { name: "0xfurai/claude-code-subagents", stars: 1000, what: "개발용 100여 개. 2025년 10월 이후 멈춰 있다." },
    ],
  },
  {
    id: "eco-plugin",
    title: "플러그인 (Plugins)",
    definition: "공식 문서: \"스킬 · 에이전트 · MCP · 훅 을 한 묶음으로 만들어 팀과 여러 프로젝트에 나눠 주는 것\".",
    howTo: `# 목록 보기 (공식 마켓은 처음 켤 때 자동으로 들어와 있다)
/plugin

# 설치
/plugin install 이름@claude-plugins-official

# 다른 마켓 추가
/plugin marketplace add anthropics/claude-plugins-community`,
    firstPick:
      "공식 마켓의 code-review 또는 pr-review-toolkit. 합치기 전에 변경을 훑어 준다. 공식 39개 중 12개가 언어별 코드 분석(LSP)이다 — 쓰는 언어 것 하나는 켜 둘 만하다.",
    items: [
      { name: "obra/superpowers", stars: 286182, what: "스킬 묶음이자 가장 큰 플러그인 배포처." },
      { name: "hesreallyhim/awesome-claude-code", stars: 53979, what: "이 바닥 대표 목록. 스킬 · 에이전트 · 플러그인 · 도구를 한자리에." },
      { name: "anthropics/claude-plugins-official", stars: 36222, official: true, what: "Anthropic 공식 마켓 39개. github · linear · notion · figma · vercel · supabase · sentry 연결과 언어별 LSP." },
      { name: "alirezarezvani/claude-skills", stars: 25900, what: "스킬 380개 · 에이전트 30개 · 명령 70개를 마켓 하나로." },
      { name: "anthropics/claude-plugins-community", stars: 3900, official: true, what: "커뮤니티 플러그인을 Anthropic 이 읽기 전용으로 모아 둔 곳." },
      { name: "trailofbits/skills-curated", stars: 499, what: "별은 적지만 보안 회사가 하나씩 검토한 것만 올린다. 남이 만든 것을 쓸 거면 여기부터." },
    ],
  },
  {
    id: "eco-mcp",
    title: "MCP (외부 도구 연결)",
    definition: "공식 문서: \"AI 를 바깥 도구 · 데이터에 연결하는 공개 표준\". 외부 프로그램을 만지게 하는 방법은 이것뿐이다.",
    howTo: `# 이 프로젝트에서만 (.mcp.json 에 적힌다 — 팀과 쓰려면 커밋)
claude mcp add --scope project 이름 주소

# 내 컴퓨터 전체
claude mcp add --scope user 이름 주소

# 지금 붙어 있는 것 보기
claude mcp list`,
    firstPick:
      "Context7 하나부터. AI 가 옛 버전 문법으로 코드를 쓰는 것을 줄여 준다. 그다음이 Playwright — AI 가 화면을 직접 열어 눌러 보게 한다. 이 수업은 이 둘을 쓴다.",
    items: [
      { name: "punkpeye/awesome-mcp-servers", stars: 94913, what: "가장 큰 MCP 목록. 뭐가 있는지 찾을 때." },
      { name: "modelcontextprotocol/servers", stars: 90294, official: true, what: "공식 기본 7개 — Everything · Fetch · Filesystem · Git · Memory · Sequential Thinking · Time. Filesystem 이 가장 많이 깔린다." },
      { name: "upstash/context7", stars: 61965, what: "라이브러리 최신 문서를 AI 에게 읽힌다. 지어내기와 옛 문법을 줄인다." },
      { name: "ChromeDevTools/chrome-devtools-mcp", stars: 51833, what: "크롬 개발자 도구를 AI 에게. 네트워크 · 콘솔 · 성능까지 본다." },
      { name: "microsoft/playwright-mcp", stars: 37064, what: "AI 가 브라우저를 열어 눌러 보고 확인한다. \"다 됐다\"는 말을 안 믿어도 된다." },
      { name: "github/github-mcp-server", stars: 32909, official: true, what: "GitHub 공식. 이슈 · PR · 커밋 · CI 를 다룬다." },
      { name: "oraios/serena", stars: 29300, what: "코드 뜻으로 찾아 고친다. 파일이 많아졌을 때." },
      { name: "GLips/Figma-Context-MCP", stars: 15800, what: "피그마 시안을 코드 쪽으로 읽어 온다." },
      { name: "makenotion/notion-mcp-server", stars: 4600, what: "노션 공식. 기획 문서를 노션에 둔다면." },
    ],
  },
];

/** 별 수를 마지막으로 읽어 온 날 — scripts/update-stars.ts 가 고친다 */
export const STARS_UPDATED = "2026-09-14";

export const ECOSYSTEM_NOTE =
  "별 수는 매일 아침 GitHub 에서 자동으로 다시 읽어 옵니다. 숫자보다 순서를 보세요. 별이 많다고 우리 프로젝트에 맞는 것은 아닙니다 — 남이 만든 것은 내용을 읽고 나서 씁니다.";

/** 286182 → "286k" · 39629 → "39.6k" · 499 → "499" */
export const formatStars = (n: number) =>
  n < 1000 ? String(n) : n < 100000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n / 1000)}k`;
