import crypto from "crypto"; // бібліотека для хешування
import readline from "readline"; // щоб отримати текст від користувача

// створюємо інтерфейс для введення
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Введіть рядок для хешування: ", (input) => {
  // Обчислення SHA-256
  const sha256 = crypto.createHash("sha256").update(input).digest("hex");

  // Обчислення SHA3-256
  const sha3 = crypto.createHash("sha3-256").update(input).digest("hex");

  console.log("\n--- Результати ---");
  console.log("SHA-256:", sha256);
  console.log("SHA-3-256:", sha3);

  console.log("\nДовжина SHA-256:", sha256.length);
  console.log("Довжина SHA-3-256:", sha3.length);

  console.log("\nВисновок:");
  console.log(
    "- SHA-256 зазвичай швидший, бо простіший алгоритм.\n" +
    "- SHA-3-256 вважається надійнішим, бо має іншу структуру (Keccak) і краще захищений від деяких типів атак."
  );

  rl.close();
});
