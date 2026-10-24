const assert = require('node:assert/strict');
const PM = require('../prime-math.js');
for (const n of [2,3,5,7,11,17,29,97]) assert.equal(PM.isPrime(n),true,`prime ${n}`);
for (const n of [0,1,4,9,25,49,77,96,729]) assert.equal(PM.isPrime(n),false,`composite ${n}`);
const expected = new Map([[54,[[2,3,3,3],8]],[84,[[2,2,3,7],12]],[96,[[2,2,2,2,2,3],12]],[154,[[2,7,11],8]],[256,[[2,2,2,2,2,2,2,2],9]],[495,[[3,3,5,11],12]],[729,[[3,3,3,3,3,3],7]],[1024,[[2,2,2,2,2,2,2,2,2,2],11]]]);
for (const [n,[factors,count]] of expected) {
 assert.deepEqual(PM.factors(n),factors);assert.equal(PM.divisorCount(n),count);
 assert.equal(factors.reduce((a,b)=>a*b,1),n);
 const actualDivisors=Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
 assert.equal(count,actualDivisors.length);
}
assert.equal(PM.type(1),'neither');assert.equal(PM.validStep(96,4,24),false);assert.equal(PM.validStep(96,2,48),true);assert.equal(PM.validStep(96,3,32),true);assert.equal(PM.validStep(54,2,26),false);assert.equal(PM.validStep(5,1,5),false);
assert.match(PM.primeProof(97),/resto/);assert.match(PM.primeProof(97),/11 · 11/);assert.ok(Number.isNaN(PM.integer('2+3')));assert.ok(Number.isNaN(PM.integer('')));
console.log('OK: primos, cuadrados, factores de los ocho apartados, recuento exhaustivo de divisores y divisiones válidas.');
