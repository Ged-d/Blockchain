import crypto from "crypto";

const r = l => [...Array(l)].map(()=> "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.random()*62|0]).join('');
const s = r(16), h1 = crypto.createHash("sha256").update(s).digest("hex");
const s2 = "a" + s.slice(1), h2 = crypto.createHash("sha256").update(s2).digest("hex");
console.log(s, h1, "\n", s2, h2, "\nВідрізняються:", h1 !== h2);

// Ефект лавини: навіть мала зміна повністю міняє хеш, що захищає блокчейн від підробки.
