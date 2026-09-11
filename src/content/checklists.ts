/** 점검 체크리스트 — 강사가 이 파일을 직접 고친다. */

export type Checklist = {
  id: string;
  /** 언제 보는 목록인지 */
  when: string;
  items: string[];
};

export const CHECKLISTS: Checklist[] = [
  {
    id: "split",
    when: "파트 나누기 전",
    items: [
      "만들 기능을 한 줄씩 적었다",
      "기능마다 맡은 사람이 한 명이다",
      "같은 파일을 두 사람이 만지지 않는다 (파일·폴더 단위로 나눴다)",
      "여러 기능이 같이 쓰는 파일(레이아웃, DB 연결)은 담당 한 명을 정했다",
      "합치는 시각을 정했다",
    ],
  },
  {
    id: "before-ask",
    when: "AI에게 새 기능 시키기 전",
    items: [
      "무엇이 화면에 보여야 하는지 한 문장으로 적었다",
      "예상 값을 하나 적어 두었다 (나중에 실제 값과 비교한다)",
      "건드리면 안 되는 파일을 AI 에게 말했다",
      "\"고치기 전에 원인을 먼저 설명해\" 라고 붙였다",
      "지금 상태를 git 에 올려 두었다 (망가지면 돌아올 곳)",
    ],
  },
  {
    id: "before-db",
    when: "DB 붙이기 전",
    items: [
      ".env.local 에 DATABASE_URL 이 있다",
      "그 값을 채팅·게시판·코드에 붙여넣지 않았다",
      ".gitignore 에 .env* 가 있다",
      "무엇을 저장할지 항목과 칸을 적었다",
      "Vercel 환경변수에도 같은 이름으로 등록했다",
    ],
  },
  {
    id: "before-merge",
    when: "합치기(git) 전",
    items: [
      "git status 가 깨끗하다 (내 것은 올렸다)",
      "push 전에 pull 을 먼저 했다",
      "충돌이 나면 멈추고 팀에 말한다",
      "force 가 들어간 명령은 하지 않는다",
      "합친 뒤 npm run build 가 통과한다",
    ],
  },
  {
    id: "before-deploy",
    when: "배포 전",
    items: [
      "내 컴퓨터에서 npm run build 가 통과한다",
      "환경변수를 Vercel 에 등록했다",
      "배포 뒤 빌드 로그가 초록색이다",
      "새로고침 · 다른 기기 · 다른 사람 — 셋 다 같은 것이 보인다",
      "저장이 걸린 동작을 하나씩 눌러 봤다",
    ],
  },
];
