/** 실행: node src/lib/auth.test.ts */
import assert from "node:assert/strict";

process.env.SESSION_SECRET = "test-secret";
const { signToken, verifyToken } = await import("./token.ts");
const { hashPassword, verifyPassword } = await import("./password.ts");

const later = Date.now() + 60_000;
const token = signToken(7, later);
assert.equal(verifyToken(token), 7, "서명이 맞으면 userId");
assert.equal(verifyToken(token + "x"), null, "서명이 틀리면 null");
assert.equal(verifyToken(`8.${later}.${token.split(".")[2]}`), null, "id 를 바꾸면 null");
assert.equal(verifyToken(signToken(7, Date.now() - 1)), null, "만료되면 null");
assert.equal(verifyToken(undefined), null);
assert.equal(verifyToken("garbage"), null);

const stored = hashPassword("비밀번호1");
assert.ok(verifyPassword("비밀번호1", stored));
assert.ok(!verifyPassword("비밀번호2", stored));
assert.ok(!verifyPassword("비밀번호1", "broken"));
assert.notEqual(hashPassword("같은값"), hashPassword("같은값"), "salt 가 매번 다르다");

console.log("모든 검사 통과");
