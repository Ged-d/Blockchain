const crypto = require("crypto");

// генеруємо пару ключів RSA-2048
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });

// повідомлення
const msg = "Hello, blockchain!";

// підписуємо приватним ключем
const sign = crypto.createSign("SHA256");
sign.update(msg);
const signature = sign.sign(privateKey, "base64");

// перевіряємо оригінал
const verify1 = crypto.createVerify("SHA256");
verify1.update(msg);
console.log("✔ Оригінал:", verify1.verify(publicKey, signature, "base64"));

// перевіряємо змінений текст
const verify2 = crypto.createVerify("SHA256");
verify2.update("Hacked text!");
console.log("❌ Змінено:", verify2.verify(publicKey, signature, "base64"));

// вивід
console.log("\nПублічний ключ:", publicKey.export({ type: "pkcs1", format: "pem" }).slice(0, 100) + "...");
console.log("Підпис (base64):", signature.slice(0, 80) + "...");
