/** 실행: node src/lib/images.test.ts */
import assert from "node:assert/strict";
import { MAX_IMAGE_BYTES, MAX_IMAGES, pickImages } from "./images.ts";

const png = (size = 3) => new File([new Uint8Array(size)], "a.png", { type: "image/png" });
const fd = new FormData();
fd.append("title", "글");
fd.append("images", new File([], "", { type: "application/octet-stream" })); // 비어 있는 file input 이 보내는 것
fd.append("images", new File([new Uint8Array(3)], "x.svg", { type: "image/svg+xml" })); // 스크립트가 들어갈 수 있어 거절
fd.append("images", png(MAX_IMAGE_BYTES + 1)); // 너무 큼
for (let i = 0; i < MAX_IMAGES + 2; i++) fd.append("images", png());

const picked = await pickImages(fd);
assert.equal(picked.length, MAX_IMAGES, "빈 것 · svg · 너무 큰 것은 빼고 최대 장수까지만");
assert.ok(picked.every((p) => p.mime === "image/png" && Buffer.isBuffer(p.data) && p.data.length === 3));
assert.deepEqual(await pickImages(new FormData()), [], "images 칸이 없으면 빈 배열");

console.log("images.test.ts 통과");
