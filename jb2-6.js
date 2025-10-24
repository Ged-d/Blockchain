const crypto = require("crypto");
const sha = (x) => crypto.createHash("sha256").update(x).digest("hex");

function merkleRoot(txs) {
  let hashes = txs.map((t) => sha(JSON.stringify(t)));
  while (hashes.length > 1) {
    if (hashes.length % 2) hashes.push(hashes[hashes.length - 1]);
    hashes = hashes.reduce((a, _, i) =>
      i % 2 ? a : [...a, sha(hashes[i] + hashes[i + 1])], []);
  }
  return hashes[0];
}

class Block {
  constructor(transactions, prevHash = "0") {
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.merkleRoot = merkleRoot(transactions);
    this.hash = sha(prevHash + this.merkleRoot);
  }
}

class Blockchain {
  constructor() { this.chain = [new Block([{ from: "genesis", to: "all", amount: 0 }])]; }
  addBlock(txs) {
    const b = new Block(txs, this.chain[this.chain.length - 1].hash);
    this.chain.push(b);
  }
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const b = this.chain[i], p = this.chain[i - 1];
      if (b.prevHash !== p.hash) return false;
      if (b.merkleRoot !== merkleRoot(b.transactions)) return false;
      if (b.hash !== sha(b.prevHash + b.merkleRoot)) return false;
    }
    return true;
  }
}

// --- Демонстрація ---
const bc = new Blockchain();
bc.addBlock([{ from: "Alice", to: "Bob", amount: 10 }, { from: "Bob", to: "Eve", amount: 5 }]);
bc.addBlock([{ from: "Eve", to: "Tom", amount: 1 }]);

console.log("Valid chain:", bc.isValid());
console.log("Merkle root 2nd block:", bc.chain[1].merkleRoot);

// Підробка
bc.chain[1].transactions[0].amount = 999;
console.log("Valid after tamper:", bc.isValid());
