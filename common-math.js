'use strict';
const CommonMath = (() => {
  function selection(numbers, mode) {
    const maps = numbers.map(n => new Map(PrimeMath.powers(n).map(p => [p.prime,p.exponent])));
    return [...new Set(maps.flatMap(m => [...m.keys()]))].sort((a,b)=>a-b).map(prime => ({prime, exponent: Math[mode === 'gcd' ? 'min' : 'max'](...maps.map(m=>m.get(prime)||0))}));
  }
  function result(numbers,mode) { return selection(numbers,mode).reduce((v,p)=>v*p.prime**p.exponent,1); }
  function integer(value) { return typeof value === 'string' && /^\d{1,7}$/.test(value.trim()) ? Number(value) : NaN; }
  return {selection,result,integer};
})();
if (typeof module !== 'undefined') module.exports = CommonMath;
