const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
const PM=require('../prime-math.js');
function setup(saved,blocked=false){
  const data=new Map([['mates-en-practica:malena:v1','distributiva'],['mates-en-practica:malena:primos:v1','primos']]);
  if(saved)data.set('mates-en-practica:malena:mcd-mcm:v1',saved);
  const notice={textContent:''},context=vm.createContext({PrimeMath:PM,document:{getElementById:()=>notice},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return data.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');data.set(k,v);}}});
  vm.runInContext(fs.readFileSync(path.join(root,'common-math.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'common.js'),'utf8').replace(/startCommon\(\);\s*$/,''),context);
  vm.runInContext('restoreCommon()',context);return {context,data,notice};
}
let a=setup();
// Compare factor selection against independent divisor and multiple definitions.
vm.runInContext(`for(let a=1;a<=60;a++)for(let b=1;b<=60;b++){
 let gcd=1;for(let d=1;d<=Math.min(a,b);d++)if(a%d===0&&b%d===0)gcd=d;
 let lcm=a;while(lcm%b!==0)lcm+=a;
 if(CM.result([a,b],'gcd')!==gcd||CM.result([a,b],'lcm')!==lcm)throw Error('Wrong calculation');
}if(CM.result([12,18,30],'lcm')!==180||CM.result([18,24,30],'gcd')!==6)throw Error('Triple');`,a.context);
vm.runInContext(`const t=tasks[0];commonState.lesson=3;commonState.current=8;commonState.items[taskId(t)]={answer:'6',powers:{2:'1',3:'1'},mode:'',solved:true};commonState.items[taskId(tasks[1])]={answer:'1',powers:{2:'1'},mode:'',solved:false};saveCommon();`,a.context);
assert.equal(a.data.get('mates-en-practica:malena:v1'),'distributiva');assert.equal(a.data.get('mates-en-practica:malena:primos:v1'),'primos');
let saved=a.data.get('mates-en-practica:malena:mcd-mcm:v1'),b=setup(saved);
assert.equal(vm.runInContext('complete(tasks[0],commonState.items[taskId(tasks[0])])',b.context),true);
assert.equal(vm.runInContext('commonState.current',b.context),8);
assert.equal(vm.runInContext('commonState.items[taskId(tasks[1])].answer',b.context),'1');
const damaged=JSON.parse(saved);Object.values(damaged.state.items)[0].powers[2]='2';b=setup(JSON.stringify(damaged));assert.equal(vm.runInContext('commonState.items[taskId(tasks[0])].solved',b.context),false);
b=setup('{bad');assert.equal(vm.runInContext('commonState.current',b.context),0);
b=setup(null,true);vm.runInContext('saveCommon()',b.context);assert.match(b.notice.textContent,/no permite guardar/);
console.log('OK: 3600 pairs, triples, coprime numbers, persistence, unfinished answers, corrupt/blocked saves, other topics untouched.');
