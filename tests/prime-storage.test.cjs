const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const PM=require('../prime-math.js');
const logic=fs.readFileSync(require('node:path').join(__dirname,'..','primes.js'),'utf8').split('restorePrimes();renderLesson();renderPrimePractice();savePrimes();')[0];
function setup(saved,blocked=false){const data=new Map([['mates-en-practica:malena:v1','old-topic-data']]);if(saved)data.set('mates-en-practica:malena:primos:v1',saved);const notice={textContent:''};const c=vm.createContext({PrimeMath:PM,document:{getElementById:()=>notice},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return data.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');data.set(k,v);}}});vm.runInContext(logic,c);vm.runInContext('restorePrimes()',c);return {c,data,notice};}
let a=setup('{bad json');assert.equal(vm.runInContext('totalPrimes()',a.c),0);
a=setup();vm.runInContext("const s=itemState(2,96);s.steps=[{divisor:3,quotient:32},{divisor:2,quotient:16},{divisor:2,quotient:8},{divisor:2,quotient:4},{divisor:2,quotient:2},{divisor:2,quotient:1}];s.powers=['5','1'];s.powersChecked=true;s.count='12';s.solved=true;primeState.stage=2;primeState.questions[2]=2;savePrimes()",a.c);
assert.equal(a.data.get('mates-en-practica:malena:v1'),'old-topic-data');let saved=a.data.get('mates-en-practica:malena:primos:v1');let b=setup(saved);assert.equal(vm.runInContext('totalPrimes()',b.c),1);assert.equal(vm.runInContext('primeState.stage',b.c),2);
let payload=JSON.parse(saved);payload.state.exercises['factor:96'].steps[0]={divisor:4,quotient:24};b=setup(JSON.stringify(payload));assert.equal(vm.runInContext('totalPrimes()',b.c),0);assert.equal(vm.runInContext('itemState(2,96).steps.length',b.c),0);
a=setup(null,true);vm.runInContext('savePrimes()',a.c);assert.match(a.notice.textContent,/no permite guardar/);
console.log('OK: persistencia separada, validación del guardado, datos dañados, bloqueo y orden alternativo de primos.');
