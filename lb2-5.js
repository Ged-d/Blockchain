const crypto = require("crypto");

// створюємо ключі
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });

// документ
const doc = "Це мій документ №1";

// підписуємо
const sign = crypto.createSign("SHA256");
sign.update(doc);
const signature = sign.sign(privateKey, "hex");

// функція перевірки
function verify(text, sig) {
  const v = crypto.createVerify("SHA256");
  v.update(text);
  return v.verify(publicKey, sig, "hex");
}

// (a) справжній
console.log("Справжній:", verify(doc, signature));
// (b) змінений
console.log("Змінено:", verify("Підроблений документ", signature));
// (c) підпис підмінено
console.log("Підпис підмінено:", verify(doc, crypto.randomBytes(256).toString("hex")));
