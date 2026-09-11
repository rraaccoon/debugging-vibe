import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL 환경변수가 없습니다 (.env.local 과 Vercel 에 넣으세요)");
const sql = neon(url);

/** shared — 학생들이 처음 들어올 때 쓰는 공용 계정. 로그인하면 바로 /setup 으로 보내 자기 계정을 만들게 한다 */
export type Role = "instructor" | "student" | "shared";
export type User = { id: number; name: string; realName: string | null; role: Role };
export type PostFields = {
  title: string;
  whatDoing: string;
  whenHappened: string;
  howDid: string;
  expected: string;
  actual: string;
};
type Author = { author: string; authorRealName: string | null; authorRole: Role };
export type PostSummary = Author & { id: number; title: string; createdAt: string; answerCount: number };
export type Post = PostFields & Author & { id: number; createdAt: string };
export type Answer = Author & { id: number; body: string; createdAt: string };

let ready: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  ready ??= createTables().catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

async function createTables(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS real_name TEXT`;
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      what_doing TEXT NOT NULL,
      when_happened TEXT NOT NULL,
      how_did TEXT NOT NULL,
      expected TEXT NOT NULL,
      actual TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      author_id INTEGER NOT NULL REFERENCES users(id),
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

const iso = (v: unknown) => new Date(v as string).toISOString();
const toUser = (r: Record<string, unknown>): User => ({
  id: r.id as number,
  name: r.name as string,
  realName: (r.real_name as string | null) ?? null,
  role: r.role as Role,
});
const toAuthor = (r: Record<string, unknown>): Author => ({
  author: r.author as string,
  authorRealName: (r.author_real_name as string | null) ?? null,
  authorRole: r.author_role as Role,
});

/* ── 계정 ── */

export async function findUserForLogin(name: string): Promise<(User & { passwordHash: string }) | null> {
  await ensureSchema();
  const [r] = await sql`SELECT id, name, real_name, role, password_hash FROM users WHERE name = ${name}`;
  return r ? { ...toUser(r), passwordHash: r.password_hash } : null;
}

export async function getUserById(id: number): Promise<User | null> {
  await ensureSchema();
  const [r] = await sql`SELECT id, name, real_name, role FROM users WHERE id = ${id}`;
  return r ? toUser(r) : null;
}

/** 같은 이름이면 비밀번호·역할을 덮어쓴다 (강사 · 공용 계정용) */
export async function upsertUser(name: string, passwordHash: string, role: Role): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO users (name, password_hash, role) VALUES (${name}, ${passwordHash}, ${role})
    ON CONFLICT (name) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
  `;
}

/** 학생이 /setup 에서 만드는 자기 계정 — name(닉네임)은 유일해야 한다 */
export async function createStudent(name: string, passwordHash: string, realName: string): Promise<number> {
  await ensureSchema();
  const [r] = await sql`
    INSERT INTO users (name, password_hash, role, real_name)
    VALUES (${name}, ${passwordHash}, 'student', ${realName})
    RETURNING id
  `;
  return r.id;
}

/* ── 질문 ── */

export async function listPosts(): Promise<PostSummary[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT p.id, p.title, p.created_at,
      u.name AS author, u.real_name AS author_real_name, u.role AS author_role,
      (SELECT count(*) FROM answers a WHERE a.post_id = p.id)::int AS answer_count
    FROM posts p JOIN users u ON u.id = p.author_id
    ORDER BY p.id DESC
  `;
  return rows.map((r) => ({
    ...toAuthor(r),
    id: r.id,
    title: r.title,
    createdAt: iso(r.created_at),
    answerCount: r.answer_count,
  }));
}

export async function getPost(id: number): Promise<{ post: Post; answers: Answer[] } | null> {
  await ensureSchema();
  const [p] = await sql`
    SELECT p.id, p.title, p.what_doing, p.when_happened, p.how_did, p.expected, p.actual, p.created_at,
      u.name AS author, u.real_name AS author_real_name, u.role AS author_role
    FROM posts p JOIN users u ON u.id = p.author_id
    WHERE p.id = ${id}
  `;
  if (!p) return null;
  const rows = await sql`
    SELECT a.id, a.body, a.created_at,
      u.name AS author, u.real_name AS author_real_name, u.role AS author_role
    FROM answers a JOIN users u ON u.id = a.author_id
    WHERE a.post_id = ${id}
    ORDER BY a.id ASC
  `;
  return {
    post: {
      ...toAuthor(p),
      id: p.id,
      title: p.title,
      whatDoing: p.what_doing,
      whenHappened: p.when_happened,
      howDid: p.how_did,
      expected: p.expected,
      actual: p.actual,
      createdAt: iso(p.created_at),
    },
    answers: rows.map((a) => ({
      ...toAuthor(a),
      id: a.id,
      body: a.body,
      createdAt: iso(a.created_at),
    })),
  };
}

export async function createPost(authorId: number, f: PostFields): Promise<number> {
  await ensureSchema();
  const [r] = await sql`
    INSERT INTO posts (author_id, title, what_doing, when_happened, how_did, expected, actual)
    VALUES (${authorId}, ${f.title}, ${f.whatDoing}, ${f.whenHappened}, ${f.howDid}, ${f.expected}, ${f.actual})
    RETURNING id
  `;
  return r.id;
}

export async function addAnswer(postId: number, authorId: number, body: string): Promise<void> {
  await ensureSchema();
  await sql`INSERT INTO answers (post_id, author_id, body) VALUES (${postId}, ${authorId}, ${body})`;
}
