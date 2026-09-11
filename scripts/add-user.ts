/**
 * 계정 만들기 · 비밀번호 바꾸기 (같은 이름이면 덮어쓴다)
 *   강사:      npm run user:add -- 이름 비밀번호 instructor
 *   학생 공용: npm run user:add -- 이름 비밀번호 shared   (학생은 이걸로 들어와 /setup 에서 자기 계정을 만든다)
 *   학생 개별: npm run user:add -- 닉네임 비밀번호        (비밀번호를 잊은 학생 초기화용)
 */
import { hashPassword } from "../src/lib/password.ts";
import { upsertUser, type Role } from "../src/lib/db.ts";

const ROLES: Record<string, Role> = { instructor: "instructor", shared: "shared", student: "student" };
const LABEL: Record<Role, string> = { instructor: "강사", shared: "학생 공용", student: "학생" };

async function main() {
  const [name, password, role = "student"] = process.argv.slice(2);
  const finalRole = ROLES[role];
  if (!name || !password || !finalRole) {
    console.error("사용법: npm run user:add -- 이름 비밀번호 [instructor|shared]");
    process.exit(1);
  }
  await upsertUser(name.trim(), hashPassword(password), finalRole);
  console.log(`${name} (${LABEL[finalRole]}) 계정 준비됨`);
}

main();
