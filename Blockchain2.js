const crypto = require("crypto");

// === 1. Клас Validator ===
class Validator {
  constructor(name, stake) {
    this.name = name;
    this.stake = stake;
  }
}

// === 2. Функція вибору валідатора ===
function chooseValidator(validators) {
  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
  let random = Math.random() * totalStake;
  for (const v of validators) {
    random -= v.stake;
    if (random <= 0) return v;
  }
  return validators[validators.length - 1];
}

// === 3. Клас Block ===
class Block {
  constructor(index, timestamp, data, previousHash, validator) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.validator = validator.name;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.validator)
      .digest("hex");
  }
}

// === 4. Клас Blockchain ===
class Blockchain {
  constructor(validators) {
    this.validators = validators;
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), "Genesis Block", "0", new Validator("System", 0));
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const validator = chooseValidator(this.validators);
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(
      previousBlock.index + 1,
      Date.now().toString(),
      data,
      previousBlock.hash,
      validator
    );
    this.chain.push(newBlock);
    console.log(Block ${newBlock.index} validated by ${validator.name} (stake = ${validator.stake}));
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      const prev = this.chain[i - 1];
      if (block.hash !== block.calculateHash()) return false;
      if (block.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

// === 5. Демонстрація ===
const validators = [
  new Validator("Alice", 5),
  new Validator("Bob", 10),
  new Validator("Charlie", 1),
];

const myBlockchain = new Blockchain(validators);

// додаємо 5 блоків
for (let i = 1; i <= 5; i++) {
  myBlockchain.addBlock({ amount: i * 10 });
}

console.log("\nIs blockchain valid?", myBlockchain.isChainValid());

// зламати дані у другому блоці
myBlockchain.chain[2].data = { amount: 9999 };

console.log("After hacking -> valid?", myBlockchain.isChainValid());

// === статистика перемог за 50 блоків ===
const wins = { Alice: 0, Bob: 0, Charlie: 0 };
for (let i = 0; i < 50; i++) {
  const v = chooseValidator(validators);
  wins[v.name]++;
}
console.log("\nValidator win frequency (50 rounds):", wins);
