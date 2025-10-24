class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty) {
    const target = "0".repeat(difficulty);
    const start = Date.now();

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const end = Date.now();
    console.log(
      Block mined: ${this.hash} (iterations: ${this.nonce}, time: ${(end - start) / 1000}s)
    );
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      data,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== prev.hash) return false;
      if (!current.hash.startsWith("0".repeat(this.difficulty))) return false;
    }
    return true;
  }
}

// Демонстрація
const myCoin = new Blockchain();
console.log("Mining block 1...");
myCoin.addBlock({ amount: 10 });

console.log("Mining block 2...");
myCoin.addBlock({ amount: 20 });

console.log("Blockchain valid?", myCoin.isChainValid());

myCoin.chain[1].data = { amount: 9999 }; // "Hacked!"
console.log("After tampering, valid?", myCoin.isChainValid());
