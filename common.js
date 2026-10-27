'use strict';
const CM = CommonMath, ce = id => document.getElementById(id);
const COMMON_KEY = 'mates-en-practica:malena:mcd-mcm:v1';
const tasks = [
  ...[[12,18],[20,30],[24,36],[18,24,30],[8,15],[16,48]].map(numbers=>({numbers,mode:'gcd'})),
  ...[[12,18],[8,12],[15,20],[12,18,30],[7,9],[16,48]].map(numbers=>({numbers,mode:'lcm'})),
  {numbers:[24,36],mode:'gcd',story:'Tienes 24 fichas verdes y 36 azules. Quieres hacer bolsas iguales, sin mezclar colores y sin que sobre ninguna ficha. ¿Cuál es el mayor número de fichas que puede tener cada bolsa?'},
  {numbers:[6,8],mode:'lcm',story:'Dos luces se encienden juntas. Una se enciende cada 6 segundos y otra cada 8 segundos. ¿Dentro de cuántos segundos coincidirán por primera vez?'},
  {numbers:[18,30],mode:'gcd',story:'Tienes cintas de 18 cm y de 30 cm. Las cortas en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuántos centímetros medirá cada trozo?'},
  {numbers:[10,15],mode:'lcm',story:'Dos autobuses salen juntos a las 9:00. Salen cada 10 y 15 minutos. ¿Cuántos minutos pasarán hasta que vuelvan a salir juntos?'}
];
const title = mode => mode === 'gcd' ? 'M.C.D.' : 'M.C.M.';
const fresh = () => ({lesson:0,current:0,items:{}});
let commonState = fresh();
const taskId = t => `${t.story?'problem':'calculate'}:${t.mode}:${t.numbers.join('-')}`;
function complete(t,s) {
  return s.solved === true && (!t.story || s.mode === t.mode) && CM.integer(s.answer) === CM.result(t.numbers,t.mode) && CM.selection(t.numbers,t.mode).every(p=>CM.integer(s.powers?.[p.prime])===p.exponent);
}
function restoreCommon() {
  try {
    const saved = JSON.parse(localStorage.getItem(COMMON_KEY));
    if (saved?.version !== 1 || !saved.state) return;
    const source = saved.state;
    if(Number.isInteger(source.lesson)&&source.lesson>=0&&source.lesson<4)commonState.lesson=source.lesson;
    if(Number.isInteger(source.current)&&source.current>=0&&source.current<tasks.length)commonState.current=source.current;
    tasks.forEach(t=>{
      const old=source.items?.[taskId(t)]; if(!old||typeof old!=='object')return;
      const s={answer:typeof old.answer==='string'?old.answer.slice(0,7):'',mode:['gcd','lcm'].includes(old.mode)?old.mode:'',powers:{},solved:false};
      CM.selection(t.numbers,t.mode).forEach(p=>{s.powers[p.prime]=typeof old.powers?.[p.prime]==='string'?old.powers[p.prime].slice(0,2):'';});
      s.solved=complete(t,{...s,solved:old.solved}); commonState.items[taskId(t)]=s;
    });
  } catch (_) { /* A damaged save never affects the other topics. */ }
}
function saveCommon() {
  try {localStorage.setItem(COMMON_KEY,JSON.stringify({version:1,state:commonState}));ce('common-save').textContent='Tu avance se guarda automáticamente en este navegador y dispositivo, también las respuestas a medio hacer. Los otros temas conservan su avance.';}
  catch(_){ce('common-save').textContent='Este navegador no permite guardar. Puedes practicar, pero el avance de este tema se perderá al recargar.';}
}
function el(tag,text='',className=''){const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e;}
function btn(text,action){const e=el('button',text);e.type='button';e.onclick=action;return e;}
function powerText(p){return `${p.prime}${p.exponent===1?'':'<sup>'+p.exponent+'</sup>'}`;}
function decomposition(n){return PrimeMath.powers(n).map(powerText).join(' · ')||'1';}
function ladder(n){let rows='';for(const p of PrimeMath.factors(n)){rows+=`<tr><td>${n}</td><td>${p}</td></tr>`;n/=p;}return `<table class="ladder-example"><caption>Divisiones sucesivas</caption><tbody>${rows}<tr><td>1</td><td></td></tr></tbody></table>`;}
function comparison(numbers,mode){const factors=CM.selection(numbers,mode);return `<div class="common-scroll"><table class="mini-table"><caption>Compara los exponentes · ${title(mode)}</caption><thead><tr><th>Primo</th>${numbers.map(n=>`<th>En ${n}</th>`).join('')}<th>Elegimos</th></tr></thead><tbody>${factors.map(p=>`<tr><th>${p.prime}</th>${numbers.map(n=>`<td>${PrimeMath.powers(n).find(x=>x.prime===p.prime)?.exponent||0}</td>`).join('')}<td><strong>${p.exponent===0?'No se toma':powerText(p)}</strong></td></tr>`).join('')}</tbody></table></div>`;}
function solution(numbers,mode){const chosen=CM.selection(numbers,mode).filter(p=>p.exponent);return `${title(mode)}(${numbers.join(', ')}) = ${chosen.map(powerText).join(' · ')||'1'} = <strong>${CM.result(numbers,mode)}</strong>`;}
const lessons = [
  {name:'1 · Entender',html:()=>`<h3 class="lesson-content-title">Dividir y multiplicar son caminos distintos</h3><div class="lesson-grid"><div class="lesson-box"><h4>Divisores: caben exactamente</h4><p>Divisores de 12: 1, 2, 3, 4, <strong>6</strong>, 12.<br>Divisores de 18: 1, 2, 3, <strong>6</strong>, 9, 18.</p><p>Comunes: 1, 2, 3 y 6. El mayor es <strong>6</strong>: M.C.D.(12, 18) = 6.</p></div><div class="lesson-box"><h4>Múltiplos: cuenta de tanto en tanto</h4><p>Múltiplos de 12: 12, 24, <strong>36</strong>, 48…<br>Múltiplos de 18: 18, <strong>36</strong>, 54…</p><p>El primero positivo que aparece en ambas listas es <strong>36</strong>: M.C.M.(12, 18) = 36.</p></div></div><p class="key-idea">El M.C.D. divide exactamente a todos los números. El M.C.M. es divisible por todos ellos. Para el M.C.M. buscamos el menor <strong>positivo</strong>, sin contar el 0.</p>`},
  {name:'2 · Descomponer',html:()=>`<h3 class="lesson-content-title">Primero descompón cada número en primos</h3><p>Escribe un divisor primo a la derecha, divide y coloca el cociente debajo. Repite hasta llegar a 1.</p><div class="lesson-grid">${[12,18].map(n=>`<div class="lesson-box"><h4>Descomposición de ${n}</h4>${ladder(n)}<p class="math-line">${n} = ${decomposition(n)}</p></div>`).join('')}</div><p class="key-idea">El exponente cuenta repeticiones: 2² = 2 · 2. Un primo sin exponente escrito tiene exponente 1. Si no aparece, lo comparamos como exponente 0. El 1 final no es un factor primo.</p><p>¿Necesitas practicar esta parte? <a href="primos.html">Repasa números primos y descomposición</a>.</p>`},
  {name:'3 · M.C.D.',html:()=>`<h3 class="lesson-content-title">Solo los comunes, con el menor exponente</h3><ol><li>Descompón: 12 = 2² · 3; 18 = 2 · 3².</li><li>Identifica los primos que aparecen en <strong>todos</strong> los números: 2 y 3.</li><li>Elige el menor exponente de cada uno y multiplica.</li></ol>${comparison([12,18],'gcd')}<p class="math-line">${solution([12,18],'gcd')}</p><p>Para dividir a ambos no puedes tomar más copias de un primo de las que tiene cualquiera de los dos.</p><p class="key-idea">Si no hay factores primos comunes, el M.C.D. es <strong>1</strong>. Por ejemplo, 8 = 2³ y 15 = 3 · 5: M.C.D.(8, 15) = 1.</p>`},
  {name:'4 · M.C.M.',html:()=>`<h3 class="lesson-content-title">Comunes y no comunes, con el mayor exponente</h3><ol><li>Descompón cada número por separado en factores primos.</li><li>Reúne todos los primos que aparecen, aunque solo estén en un número.</li><li>De cada primo, toma el mayor exponente.</li><li>Multiplica los factores elegidos.</li></ol><div class="lesson-grid">${[8,12].map(n=>`<div class="lesson-box">${ladder(n)}<p class="math-line">${n} = ${decomposition(n)}</p></div>`).join('')}</div>${comparison([8,12],'lcm')}<p class="math-line">${solution([8,12],'lcm')}</p><p>Necesitas tres copias del 2 para que sea múltiplo de 8, y también el 3 para que sea múltiplo de 12. Comprueba: 24 ÷ 8 = 3 y 24 ÷ 12 = 2.</p><p class="key-idea">No multipliques directamente los números: 8 · 12 = 96 es un múltiplo común, pero no el menor. Tampoco repitas los factores comunes al reunirlos.</p>`}
];
function renderGuide(){ce('guide-tabs').replaceChildren(...lessons.map((l,i)=>{const b=btn(l.name,()=>{commonState.lesson=i;renderGuide();saveCommon();});if(i===commonState.lesson)b.setAttribute('aria-current','step');return b;}));ce('guide').innerHTML=lessons[commonState.lesson].html();ce('step-count').textContent=`Paso ${commonState.lesson+1} de 4`;ce('guide-prev').disabled=commonState.lesson===0;ce('guide-next').disabled=commonState.lesson===3;}
function renderCommon(){
  const count=tasks.filter(t=>complete(t,commonState.items[taskId(t)]||{})).length;
  ce('common-score').textContent=`${count} / ${tasks.length}`;ce('common-progress').value=count;
  ce('common-questions').replaceChildren(...tasks.map((t,i)=>{const b=btn(`${i+1}${complete(t,commonState.items[taskId(t)]||{})?' ✓':''}`,()=>{commonState.current=i;renderCommon();saveCommon();});b.setAttribute('aria-label',`Ejercicio ${i+1}${t.story?', problema':', '+title(t.mode)}${complete(t,commonState.items[taskId(t)]||{})?', resuelto':''}`);if(i===commonState.current)b.setAttribute('aria-current','step');return b;}));
  const t=tasks[commonState.current],s=commonState.items[taskId(t)]||(commonState.items[taskId(t)]={powers:{},answer:'',mode:'',solved:false}),root=ce('common-exercise');root.replaceChildren(el('h3',`Ejercicio ${commonState.current+1} · ${t.story?'Elige y resuelve':title(t.mode)+'('+t.numbers.join(', ')+')'}`));
  if(t.story)root.append(el('p',t.story));
  const form=el('form');root.append(form);
  if(t.story){const label=el('label','¿Qué necesitas calcular? '),select=el('select');[['','Elige'],['gcd','M.C.D.'],['lcm','M.C.M.']].forEach(([v,txt])=>{const o=el('option',txt);o.value=v;select.append(o);});select.value=s.mode;select.disabled=s.solved;select.onchange=()=>{s.mode=select.value;saveCommon();};label.append(select);form.append(label);}
  const hint=el('details'),summary=el('summary','Ver descomposición y ayuda');hint.append(summary);const help=el('div');help.innerHTML=t.numbers.map(n=>`<p class="math-line">${n} = ${decomposition(n)}</p>`).join('')+`<p>${t.story?'Piensa: ¿repartir o cortar sin sobrar (M.C.D.), o volver a coincidir (M.C.M.)?':t.mode==='gcd'?'Busca comunes con el menor exponente.':'Busca comunes y no comunes con el mayor exponente.'}</p>`;hint.append(help);form.append(hint);
  form.append(el('p','1. Elige el exponente de cada primo. Escribe 0 si no lo tomas. Un exponente 1 significa tomar el primo una vez.'));
  const fields=el('div','','prime-fields');form.append(fields);
  function field(labelText,value,onInput,max=2){const label=el('label',labelText),input=el('input');input.type='text';input.inputMode='numeric';input.autocomplete='off';input.maxLength=max;input.value=value||'';input.disabled=s.solved;input.oninput=()=>{onInput(input.value);saveCommon();};label.append(input);fields.append(label);return input;}
  const selected=CM.selection(t.numbers,t.mode);selected.forEach(p=>field(`Exponente del ${p.prime}`,s.powers[p.prime],v=>s.powers[p.prime]=v));
  form.append(el('p','2. Multiplica los factores elegidos y escribe el resultado.'));const answerBox=el('div','','prime-fields');form.append(answerBox);const answer=field('Resultado',s.answer,v=>s.answer=v,7);answerBox.append(answer.parentNode);
  const check=btn(s.solved?'Resuelto ✓':'Comprobar',()=>{});check.type='submit';check.className='primary';check.disabled=s.solved;form.append(check);const feedback=el('p','','feedback');feedback.setAttribute('role','status');form.append(feedback);
  if(s.solved){feedback.className='feedback success';feedback.innerHTML=solution(t.numbers,t.mode);}
  form.onsubmit=e=>{e.preventDefault();let message='';if(t.story&&s.mode!==t.mode)message=t.mode==='gcd'?'Aquí buscamos el mayor tamaño que divide exactamente ambas cantidades: usa M.C.D.':'Aquí buscamos la primera coincidencia positiva: usa M.C.M.';
    else {const wrong=selected.find(p=>CM.integer(s.powers[p.prime])!==p.exponent);if(wrong){const exps=t.numbers.map(n=>PrimeMath.powers(n).find(p=>p.prime===wrong.prime)?.exponent||0);message=`Revisa el primo ${wrong.prime}: sus exponentes son ${exps.join(', ')}. ${t.mode==='gcd'?'Toma el menor; si alguno es 0, no es común a todos.':'Toma el mayor, aunque no aparezca en todos.'}`;}else if(CM.integer(s.answer)!==CM.result(t.numbers,t.mode))message='Los factores están bien elegidos. Revisa la multiplicación: primero calcula las potencias, luego multiplica.';}
    if(message){feedback.className='feedback error';feedback.textContent=message;return;}s.solved=true;saveCommon();renderCommon();};
  ce('common-prev').disabled=commonState.current===0;ce('common-next').disabled=commonState.current===tasks.length-1;
}
function startCommon(){restoreCommon();renderGuide();renderCommon();saveCommon();ce('guide-prev').onclick=()=>{if(commonState.lesson>0)commonState.lesson--;renderGuide();saveCommon();};ce('guide-next').onclick=()=>{if(commonState.lesson<3)commonState.lesson++;renderGuide();saveCommon();};for(const [id,delta] of [['common-prev',-1],['common-next',1]])ce(id).onclick=()=>{commonState.current=Math.max(0,Math.min(tasks.length-1,commonState.current+delta));renderCommon();saveCommon();};}
startCommon();
