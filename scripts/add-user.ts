/** 수업 계정 만들기 — npm run user:add -- 이름 비밀번호 [instructor] */
import { hashPassword } from "../src/lib/password.ts";
import { upsertUser } from "../src/lib/db.ts";

async function main() {
  const [name, password, role] = process.argv.slice(2);
  if (!name || !password) {
    console.error("사용법: npm run user:add -- 이름 비밀번호 [instructor]");
    process.exit(1);
  }
  const finalRole = role === "instructor" ? "instructor" : "student";
  await upsertUser(name.trim(), hashPassword(password), finalRole);
  console.log(`${name} (${finalRole === "instructor" ? "강사" : "학생"}) 계정 준비됨`);
}

main();
