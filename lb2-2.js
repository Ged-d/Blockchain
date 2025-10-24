import crypto from "crypto";

function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

let str = randomString(16);
let hash1 = crypto.createHash("sha256").update(str).digest("hex");

let changed = str.split('');
changed[0] = changed[0] === 'a' ? 'b' : 'a'; // змінюємо один символ
changed = changed.join('');
let hash2 = crypto.createHash("sha256").update(changed).digest("hex");

console.log("Рядок 1:", str);
console.log("Хеш 1:", hash1);
console.log("Рядок 2:", changed);
console.log("Хеш 2:", hash2);
console.log("Відрізняються:", hash1 !== hash2);

// Ефект лавини важливий у блокчейні, бо навіть мінімальна зміна даних змінює хеш,
// що робить підробку блоків практично неможливою.
