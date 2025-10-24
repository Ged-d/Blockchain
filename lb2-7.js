const crypto = require("crypto");
const sha = x => crypto.createHash("sha256").update(x).digest("hex");

function buildMerkle(txs) {
  let layer = txs.map(sha);
  const tree = [layer];
  while (layer.length > 1) {
    if (layer.length % 2) layer.push(layer[layer.length - 1]);
    layer = layer.reduce((a, _, i) => i % 2 ? a : [...a, sha(layer[i] + layer[i + 1])], []);
    tree.unshift(layer);
  }
  return tree;
}

function getProof(txs, tx) {
  const tree = buildMerkle(txs);
  let idx = txs.findIndex(t => sha(t) === sha(tx));
  if (idx < 0) return [];
  const proof = [];
  for (let i = tree.length - 1; i > 0; i--) {
    const layer = tree[i];
    const isRight = idx % 2;
    const pairIdx = isRight ? idx - 1 : idx + 1;
    if (pairIdx < layer.length)
      proof.push({ dir: isRight ? "L" : "R", hash: layer[pairIdx] });
    idx = Math.floor(idx / 2);
  }
  return proof;
}

function verifyProof(tx, proof, root) {
  let h = sha(tx);
  for (const p of proof)
    h = p.dir === "L" ? sha(p.hash + h) : sha(h + p.hash);
  return h === root;
}

// --- Demo ---
const txs = ["A->B:10", "B->C:5", "C->D:2", "D->E:1"];
const tree = buildMerkle(txs);
const root = tree[0][0];
const tx = txs[1];
const proof = getProof(txs, tx);

console.log("tx:", tx);
console.log("proof:", proof);
console.log("verify ok:", verifyProof(tx, proof, root));
console.log("tampered tx:", verifyProof("B->C:6", proof, root));
console.log("wrong proof:", verifyProof(tx, [{dir:"L",hash:"ffff"}], root));
console.log("nonexistent tx:", verifyProof("X->Y:1", proof, root));
