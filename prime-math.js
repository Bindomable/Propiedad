'use strict';
// Operaciones con enteros; las respuestas nunca se evalúan como código.
const PrimeMath = (() => {
  function isPrime(n) {
    if (!Number.isSafeInteger(n) || n < 2) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  }
  function factors(n) {
    const result = [];
    for (let d = 2; d * d <= n; d++) {
      while (n % d === 0) { result.push(d); n /= d; }
    }
    if (n > 1) result.push(n);
    return result;
  }
  function powers(n) {
    return [...new Set(factors(n))].map(prime => ({ prime, exponent: factors(n).filter(p => p === prime).length }));
  }
  function divisorCount(n) { return powers(n).reduce((total, p) => total * (p.exponent + 1), 1); }
  function type(n) { return n < 2 ? 'neither' : isPrime(n) ? 'prime' : 'composite'; }
  function integer(value) {
    return typeof value === 'string' && /^\d{1,6}$/.test(value.trim()) ? Number(value.trim()) : NaN;
  }
  function validStep(n, divisor, quotient) {
    return isPrime(divisor) && n % divisor === 0 && quotient === n / divisor;
  }
  function primeProof(n) {
    if (n === 2) return 'Sus divisores son 1 y 2: tiene exactamente dos. Es el único primo par.';
    const checks = [];
    for (let p = 2; p * p <= n; p++) {
      if (isPrime(p)) checks.push(`${n} ÷ ${p} deja resto ${n % p}`);
    }
    let next = 2;
    while (!isPrime(next) || next * next <= n) next++;
    return `${checks.length ? checks.join('; ') + '. ' : ''}El siguiente primo es ${next} y ${next} · ${next} > ${n}. No hay divisores distintos de 1 y ${n}: es primo.`;
  }
  return { isPrime, factors, powers, divisorCount, type, integer, validStep, primeProof };
})();
if (typeof module !== 'undefined') module.exports = PrimeMath;
