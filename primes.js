'use strict';
const PM = PrimeMath;
const PRIMES_KEY = 'mates-en-practica:malena:primos:v1';
const primeStages = [
  {id:'recognize', title:'1 · Primo o compuesto', help:'Clasifica el número. Si es compuesto, demuestra por qué escribiendo un divisor distinto de 1 y del propio número.', numbers:[1,2,9,17,25,29,49,97]},
  {id:'choose', title:'2 · Elige un divisor primo', help:'Busca el MENOR divisor primo y calcula el cociente. Prueba 2, 3, 5, 7… en ese orden.', numbers:[18,35,49,77]},
  {id:'factor', title:'3 · Ejercicio 52', help:'Descompón en columna, agrupa los factores iguales en potencias y calcula cuántos divisores tiene el número, como en tu cuaderno.', numbers:[54,84,96,154,256,495,729,1024]}
];
const primeLessons = [
  {title:'Reconocer', heading:'Un primo tiene exactamente dos divisores', html:`
  <p>Un <strong>divisor</strong> de un número lo divide exactamente: el resto es 0. Por ejemplo, 3 es divisor de 12 porque 12 ÷ 3 = 4.</p>
  <div class="lesson-grid"><div class="lesson-box"><h4>Número primo</h4><p>Es un natural mayor que 1 que solo tiene dos divisores: <strong>1 y él mismo</strong>.</p><p>Los divisores de 7 son 1 y 7. Por eso 7 es primo.</p></div><div class="lesson-box"><h4>Número compuesto</h4><p>Es un natural mayor que 1 con <strong>más de dos divisores</strong>.</p><p>Los de 12 son 1, 2, 3, 4, 6 y 12. Como 12 = 3 · 4, ya sabemos que es compuesto.</p></div></div>
  <p class="key-idea"><strong>El 1 no es primo ni compuesto:</strong> tiene un solo divisor, el 1. El 2 sí es primo y es el único primo par. Ser impar no basta: 9 = 3 · 3 es compuesto.</p>`, question:'¿Qué demuestra que 21 es compuesto?', options:['21 = 3 · 7','21 es impar'], answer:0, feedback:'3 divide a 21 y no es ni 1 ni 21. Eso basta para demostrar que es compuesto. Ser impar no demuestra que sea primo.'},
  {title:'Comprobar', heading:'¿Cómo sé si un número es primo?', html:`
  <ol><li>Si es 1, no es primo ni compuesto.</li><li>Si es mayor que 1, prueba los divisores <strong>primos</strong> en orden: 2, 3, 5, 7, 11… Si divides exactamente por uno menor que el número, es compuesto.</li><li>Si no encuentras ninguno, puedes parar cuando el cuadrado del siguiente primo sea mayor que el número. Si hubiera dos factores mayores, su producto ya sería demasiado grande.</li></ol>
  <div class="lesson-grid"><div class="lesson-box"><h4>Ejemplo: 29</h4><p>No se divide exactamente por 2, 3 ni 5. El siguiente primo es 7 y 7 · 7 = 49 &gt; 29. <strong>29 es primo.</strong></p></div><div class="lesson-box"><h4>Cuidado con 49</h4><p>No se divide por 2, 3 ni 5, pero hay que probar 7: 7 · 7 = 49, que no es mayor. Como 49 ÷ 7 = 7, <strong>49 es compuesto.</strong></p></div></div>
  <details><summary>Atajos para encontrar divisores</summary><table class="mini-table"><caption>Criterios de divisibilidad</caption><thead><tr><th>Divisor</th><th>Cómo comprobarlo</th><th>Ejemplo</th></tr></thead><tbody><tr><td>2</td><td>Termina en 0, 2, 4, 6 u 8.</td><td>54 termina en 4.</td></tr><tr><td>3</td><td>La suma de sus cifras es múltiplo de 3.</td><td>54: 5 + 4 = 9.</td></tr><tr><td>5</td><td>Termina en 0 o en 5.</td><td>495 termina en 5.</td></tr><tr><td>7, 11…</td><td>Prueba la división: debe dar resto 0.</td><td>77 ÷ 7 = 11.</td></tr></tbody></table></details>`, question:'49 no es divisible por 2, 3 ni 5. ¿Ya puedo decir que es primo?', options:['Sí, ya he probado tres números','No, todavía debo probar el 7'], answer:1, feedback:'Hay que probar 7 porque 7 · 7 = 49. La división es exacta: 49 es compuesto.'},
  {title:'Descomponer', heading:'Divide en columna hasta llegar a 1', html:`
  <p>Descomponer en factores primos es escribir un número como un <strong>producto formado solo por números primos</strong>. Seguimos las divisiones sucesivas del libro y de tu cuaderno.</p>
  <div class="lesson-grid"><div><ol><li>Escribe el número a la izquierda de una línea vertical.</li><li>Busca un divisor primo; normalmente, el menor. Escríbelo a la derecha.</li><li>Divide y escribe el cociente debajo, a la izquierda.</li><li>Repite con ese cociente. Puedes usar el mismo primo varias veces. <strong>Termina cuando el cociente sea 1.</strong></li></ol></div><div class="lesson-box"><h4>El ejemplo del libro: 45</h4><table class="ladder-example" aria-label="45 dividido sucesivamente por 3, 3 y 5 hasta 1"><tbody><tr><td>45</td><td>3</td></tr><tr><td>15</td><td>3</td></tr><tr><td>5</td><td>5</td></tr><tr><td>1</td><td></td></tr></tbody></table><p>45 ÷ 3 = 15; 15 ÷ 3 = 5; 5 ÷ 5 = 1.</p><p class="math-line">45 = 3 · 3 · 5 = 3² · 5</p></div></div>
  <p class="key-idea">Si el cociente ya es primo, divídelo por sí mismo para llegar a 1. El <strong>1 no se escribe como factor primo</strong>: es la señal de que hemos terminado.</p>`, question:'En la columna de 45 has llegado al cociente 5. ¿Qué haces?', options:['Paro porque 5 es primo','Divido 5 entre 5 y llego a 1'], answer:1, feedback:'La columna termina en 1. Antes escribes 5 a la derecha y divides 5 ÷ 5 = 1.'},
  {title:'Agrupar y contar', heading:'De los factores a las potencias y los divisores', html:`
  <p>Al llegar a 1, multiplica los primos de la columna derecha. Si un primo se repite, agrúpalo en una potencia: el <strong>exponente cuenta cuántas veces aparece</strong>.</p>
  <div class="lesson-box"><p class="math-line">54 = 2 · 3 · 3 · 3 = 2¹ · 3³</p><p>Para contar sus divisores, suma 1 a cada exponente y multiplica:</p><p class="math-line">(1 + 1) · (3 + 1) = 2 · 4 = 8 divisores</p><p>Son 1, 2, 3, 6, 9, 18, 27 y 54. Se cuentan también el 1 y el propio número. Si un exponente no se escribe, vale 1.</p></div>
  <p>Funciona porque un divisor de 54 puede llevar cero o un factor 2 (2 opciones) y cero, uno, dos o tres factores 3 (4 opciones). En total, 2 · 4 = 8.</p>
  <p class="key-idea"><strong>Comprueba que todos los factores sean primos.</strong> 96 = 3 · 4 · 8 es un producto correcto, pero aún no es una descomposición en primos: 4 = 2 · 2 y 8 = 2 · 2 · 2. Por eso <strong>96 = 2⁵ · 3</strong> y tiene (5 + 1) · (1 + 1) = <strong>12 divisores</strong>.</p>`, question:'¿Puedes aplicar la regla de los exponentes directamente a 96 = 3 · 4 · 8?', options:['Sí, tiene tres factores','No, primero hay que descomponer 4 y 8 en primos'], answer:1, feedback:'La regla se aplica a potencias de primos distintos. En 96 son 2⁵ y 3¹: (5 + 1) · (1 + 1) = 12 divisores.'}
];
const pe = id => document.getElementById(id);
const freshPrimeState = () => ({lesson:0, checks:[], stage:0, questions:[0,0,0], exercises:{}});
let primeState = freshPrimeState();
const itemId = (stage,n) => `${primeStages[stage].id}:${n}`;
const blankItem = () => ({values:[],selected:'',steps:[],powers:[],powersChecked:false,count:'',solved:false,hint:false});
function itemState(stage,n) {
  const key = itemId(stage,n);
  return primeState.exercises[key] || (primeState.exercises[key] = blankItem());
}
function completeItem(stage,n,state) {
  if (stage === 0) return state.solved && state.selected === PM.type(n) && (state.selected !== 'composite' || (PM.integer(state.values[0]) > 1 && PM.integer(state.values[0]) < n && n % PM.integer(state.values[0]) === 0));
  if (stage === 1) return state.solved && PM.integer(state.values[0]) === PM.factors(n)[0] && PM.integer(state.values[1]) === n / PM.factors(n)[0];
  let remaining = n;
  for (const step of state.steps) {
    if (!PM.validStep(remaining,step.divisor,step.quotient)) return false;
    remaining = step.quotient;
  }
  return state.solved && remaining === 1 && state.powersChecked && PM.powers(n).every((p,i) => PM.integer(state.powers[i]) === p.exponent) && PM.integer(state.count) === PM.divisorCount(n);
}
function restorePrimes() {
  try {
    const saved = JSON.parse(localStorage.getItem(PRIMES_KEY));
    if (!saved || saved.version !== 1 || !saved.state || typeof saved.state !== 'object') return;
    const source = saved.state;
    if (Number.isInteger(source.lesson) && source.lesson >= 0 && source.lesson < 4) primeState.lesson = source.lesson;
    if (Number.isInteger(source.stage) && source.stage >= 0 && source.stage < 3) primeState.stage = source.stage;
    primeState.checks = Array.from({length:4},(_,i) => source.checks?.[i] === true);
    primeState.questions = primeStages.map((s,i) => Number.isInteger(source.questions?.[i]) && source.questions[i] >= 0 && source.questions[i] < s.numbers.length ? source.questions[i] : 0);
    primeStages.forEach((stage,s) => stage.numbers.forEach(n => {
      const old = source.exercises?.[itemId(s,n)];
      if (!old || typeof old !== 'object') return;
      const state = blankItem();
      const strings = (values,length) => Array.from({length},(_,i) => typeof values?.[i] === 'string' ? values[i].slice(0,6) : '');
      state.values = strings(old.values,2); state.powers = strings(old.powers,PM.powers(n).length);
      state.selected = ['prime','composite','neither'].includes(old.selected) ? old.selected : '';
      state.count = typeof old.count === 'string' ? old.count.slice(0,6) : '';
      state.hint = old.hint === true;
      let remaining = n;
      for (const step of (Array.isArray(old.steps) ? old.steps.slice(0,16) : [])) {
        if (!step || !PM.validStep(remaining,step.divisor,step.quotient)) break;
        state.steps.push({divisor:step.divisor,quotient:step.quotient}); remaining = step.quotient;
      }
      state.powersChecked = remaining === 1 && old.powersChecked === true && PM.powers(n).every((p,i) => PM.integer(state.powers[i]) === p.exponent);
      state.solved = old.solved === true; state.solved = Boolean(completeItem(s,n,state));
      primeState.exercises[itemId(s,n)] = state;
    }));
  } catch (_) { /* El resto de la web sigue disponible aunque este guardado esté dañado. */ }
}
function savePrimes() {
  try {
    localStorage.setItem(PRIMES_KEY,JSON.stringify({version:1,state:primeState}));
    pe('prime-save-status').textContent = 'Malena, este tema también se guarda automáticamente en este navegador. Cada ejercicio completo suma 1 punto; puedes reintentarlo sin perder puntos.';
  } catch (_) {
    pe('prime-save-status').textContent = 'Este navegador no permite guardar el avance. Puedes practicar, pero se perderá al cerrar o recargar la página.';
  }
}
function node(tag, className='', text='') {
  const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el;
}
function button(text,action,primary=false) {
  const el = node('button',primary ? 'primary' : '',text); el.type = 'button'; el.addEventListener('click',action); return el;
}
function feedbackFor(form) {
  const el = node('p','feedback prime-feedback'); el.setAttribute('role','status'); form.append(el);
  return (text,success=false) => { el.textContent = text; el.className = `feedback prime-feedback ${success ? 'success' : 'error'}`; };
}
function field(parent,labelText,value,onInput,disabled=false) {
  const label = node('label','',labelText), input = document.createElement('input');
  input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off'; input.spellcheck = false; input.maxLength = 6;
  input.value = value || ''; input.disabled = disabled;
  input.addEventListener('input',() => { input.removeAttribute('aria-invalid'); onInput(input.value); savePrimes(); });
  label.append(input); parent.append(label); return input;
}
function submitButton(form,text) { const el = node('button','primary',text); el.type = 'submit'; form.append(el); return el; }
function markWrong(input) { input.setAttribute('aria-invalid','true'); input.focus(); }
function totalPrimes() { return primeStages.reduce((sum,stage,s) => sum + stage.numbers.filter(n => completeItem(s,n,itemState(s,n))).length,0); }
function updatePrimeProgress() {
  const total = totalPrimes(); pe('prime-score').textContent = `${total} / 20`; pe('prime-progress').value = total;
  pe('prime-progress-text').textContent = `${total} de 20 ejercicios resueltos`;
  pe('prime-encouragement').textContent = total === 20 ? '¡20 de 20! Ya has practicado cómo reconocer, descomponer y contar.' : 'Piensa cada paso. Las pistas te ayudan sin quitarte puntos.';
}
function renderLesson() {
  const index = primeState.lesson, lesson = primeLessons[index];
  pe('lesson-counter').textContent = `Paso ${index+1} de 4`; pe('lesson-tabs').replaceChildren();
  primeLessons.forEach((item,i) => {
    const b = button(`${i+1} · ${item.title}`,() => { primeState.lesson=i;savePrimes();renderLesson(); });
    if (i === index) b.setAttribute('aria-current','step'); pe('lesson-tabs').append(b);
  });
  const target = pe('lesson-content'); target.innerHTML = `<h3 class="lesson-content-title">${lesson.heading}</h3>${lesson.html}`;
  const quiz = node('div','lesson-box'); quiz.append(node('h4','','Comprueba que lo has entendido'),node('p','',lesson.question));
  const choices = node('div','choices'), reply = node('p','feedback'); reply.setAttribute('role','status');
  lesson.options.forEach((option,i) => choices.append(button(option,() => {
    const correct = i === lesson.answer;
    reply.className = `feedback ${correct ? 'success' : 'error'}`; reply.textContent = `${correct ? '¡Eso es! ' : 'Piénsalo de nuevo. '}${lesson.feedback}`;
    if (correct) {primeState.checks[index]=true;savePrimes();}
  })));
  if (primeState.checks[index]) {reply.className='feedback success';reply.textContent=`Ya lo has comprobado. ${lesson.feedback}`;}
  quiz.append(choices,reply); target.append(quiz);
  pe('lesson-prev').disabled=index===0;
  pe('lesson-next').textContent=index===3?'Ir a practicar':'Siguiente paso';
}
function powerHtml(n) { return PM.powers(n).map(p=>`${p.prime}${p.exponent===1?'':`<sup>${p.exponent}</sup>`}`).join(' · '); }
function classExplanation(n,state) {
  if (state.selected === 'neither') return 'El 1 tiene un único divisor: el 1. No cumple la definición de primo ni la de compuesto.';
  if (state.selected === 'prime') return PM.primeProof(n);
  const d = PM.integer(state.values[0]); return `${n} ÷ ${d} = ${n/d}, con resto 0. ${d} es un divisor distinto de 1 y de ${n}; por tanto, ${n} es compuesto.`;
}
function renderRecognize(target,n,state) {
  const form = document.createElement('form');form.noValidate=true;
  const set = node('fieldset','choice-group'), legend = node('legend','','¿Cómo clasificas este número?');set.append(legend);
  const choices = node('div','choices'), witness = node('div','prime-fields');
  const divisor = field(witness,`Un divisor de ${n} distinto de 1 y ${n}`,state.values[0],v=>state.values[0]=v,state.solved);
  witness.hidden=state.selected!=='composite';
  [['prime','Primo'],['composite','Compuesto'],['neither','Ni primo ni compuesto']].forEach(([value,labelText]) => {
    const label=node('label','choice'), input=document.createElement('input');input.type='radio';input.name='classification';input.value=value;input.checked=state.selected===value;input.disabled=state.solved;
    input.addEventListener('change',()=>{state.selected=value;witness.hidden=value!=='composite';savePrimes();});label.append(input,document.createTextNode(labelText));choices.append(label);
  });
  set.append(choices);form.append(set,witness);const check=submitButton(form,state.solved?'Resuelto ✓':'Comprobar');check.disabled=state.solved;
  const reply=feedbackFor(form);
  if(state.solved)reply(`¡Correcto! ${classExplanation(n,state)}`,true);
  form.addEventListener('submit',event=>{
    event.preventDefault();if(state.solved)return;
    if(!state.selected){reply('Elige una de las tres opciones.');return;}
    if(state.selected!==PM.type(n)){
      reply(n===1?'Cuenta sus divisores: el 1 solo tiene uno. Un primo necesita exactamente dos.':n===2?'El 2 tiene exactamente dos divisores: 1 y 2. Ser par no lo convierte en compuesto.':PM.isPrime(n)?`No basta con pensar que parece compuesto: busca un divisor distinto de 1 y de ${n}. Si no existe, es primo.`:`${n} es mayor que 1 y tiene un divisor distinto de 1 y de sí mismo. Prueba a dividirlo entre ${PM.factors(n)[0]}.`);return;
    }
    if(state.selected==='composite'){
      const d=PM.integer(state.values[0]);
      if(!(d>1&&d<n&&n%d===0)){markWrong(divisor);reply(`Necesitas un divisor exacto mayor que 1 y menor que ${n}. Comprueba que el resto de la división sea 0.`);return;}
    }
    state.solved=true;savePrimes();renderPrimePractice();
  });target.append(form);
}
function renderChoose(target,n,state) {
  const form=document.createElement('form');form.noValidate=true;
  form.append(node('p','',`Completa: ${n} ÷ divisor primo = cociente.`));const fields=node('div','prime-fields');
  const divisor=field(fields,'Menor divisor primo',state.values[0],v=>state.values[0]=v,state.solved);
  const quotient=field(fields,'Cociente',state.values[1],v=>state.values[1]=v,state.solved);
  form.append(fields);const check=submitButton(form,state.solved?'Resuelto ✓':'Comprobar');check.disabled=state.solved;const reply=feedbackFor(form);
  if(state.solved)reply(`¡Correcto! ${n} ÷ ${state.values[0]} = ${state.values[1]}. El divisor ${state.values[0]} es primo.`,true);
  form.addEventListener('submit',e=>{
    e.preventDefault();if(state.solved)return;
    const d=PM.integer(state.values[0]),q=PM.integer(state.values[1]);
    if(!PM.isPrime(d)){markWrong(divisor);reply(d===1?'El 1 no es primo. Empieza probando por 2.':'El divisor debe ser un número primo. 4, 6, 8 y 9 son compuestos.');return;}
    if(n%d!==0){markWrong(divisor);reply(`${n} no se divide exactamente por ${d}. Busca un primo que deje resto 0.`);return;}
    if(d!==PM.factors(n)[0]){markWrong(divisor);reply(`${d} es un divisor primo válido, pero aquí te pedimos el MENOR. Prueba los primos anteriores.`);return;}
    if(q!==n/d){markWrong(quotient);reply(`El divisor está bien. Revisa ${n} ÷ ${d}: divisor por cociente debe dar ${n}.`);return;}
    state.solved=true;savePrimes();renderPrimePractice();
  });target.append(form);
}
function renderFactor(target,n,state) {
  const layout=node('div','factor-layout'), table=node('table','working-ladder');table.append(node('caption','','Número | divisor primo'));
  const body=node('tbody');let remaining=n;
  for(const step of state.steps){const row=node('tr');row.append(node('td','',String(remaining)),node('td','',String(step.divisor)));body.append(row);remaining=step.quotient;}
  const last=node('tr');last.append(node('td','',String(remaining)),node('td','',''));body.append(last);table.append(body);
  const work=node('div','factor-work');layout.append(table,work);target.append(layout);
  if(remaining!==1){
    work.append(node('h5','',`Paso ${state.steps.length+1}: descompón ${remaining}`),node('p','',`Busca un divisor primo de ${remaining}. Normalmente se empieza por el menor.`));
    const form=document.createElement('form');form.noValidate=true;const fields=node('div','prime-fields');
    const divisor=field(fields,'Divisor primo',state.values[0],v=>state.values[0]=v);
    const quotient=field(fields,'Cociente',state.values[1],v=>state.values[1]=v);form.append(fields);submitButton(form,'Comprobar paso');const reply=feedbackFor(form);
    form.addEventListener('submit',e=>{
      e.preventDefault();const d=PM.integer(state.values[0]),q=PM.integer(state.values[1]);
      if(!PM.isPrime(d)){
        markWrong(divisor);reply(d===1?'El 1 no es primo: no puede ir en la columna derecha. Buscamos un divisor primo.':Number.isInteger(d)&&d>1?`${d} es compuesto: ${d} = ${PM.factors(d).join(' · ')}. En la columna derecha solo escribimos primos.`:'Escribe un número primo, como 2, 3, 5 o 7.');return;
      }
      if(remaining%d!==0){markWrong(divisor);reply(`${remaining} ÷ ${d} no es exacta. El divisor primo debe dejar resto 0.`);return;}
      if(q!==remaining/d){markWrong(quotient);reply(`El divisor es válido. Revisa el cociente: ${d} multiplicado por tu respuesta debe dar ${remaining}.`);return;}
      const smallest=d===PM.factors(remaining)[0];
      state.steps.push({divisor:d,quotient:q});state.values=[];savePrimes();renderPrimePractice();
      const message=node('p','feedback success',`¡Paso correcto! ${remaining} ÷ ${d} = ${q}.${!smallest?' Ese primo es válido; normalmente elegimos el menor para ordenar la columna.':''}${q===1?' Has llegado a 1: ahora agrupa los factores.':''}`);
      message.setAttribute('role','status'); pe('prime-exercise').prepend(message);
      pe('prime-exercise').querySelector('input:not(:disabled)')?.focus();
    });work.append(form);return;
  }
  work.append(node('p','',`Has llegado a 1. Los primos de la columna derecha son: ${state.steps.map(s=>s.divisor).join(' · ')}.`));
  if(!state.powersChecked){
    work.append(node('h5','','Agrupa los factores iguales'),node('p','','Completa cada exponente contando cuántas veces aparece ese primo en la columna. Si solo aparece una vez, escribe 1.'));
    const form=document.createElement('form');form.noValidate=true;const fields=node('div','power-fields'),inputs=[];
    PM.powers(n).forEach((p,i)=>{const piece=node('div','power-field');piece.append(node('strong','',String(p.prime)));inputs.push(field(piece,`Exponente de ${p.prime}`,state.powers[i],v=>state.powers[i]=v));fields.append(piece);});
    form.append(fields);submitButton(form,'Comprobar potencias');const reply=feedbackFor(form);
    form.addEventListener('submit',e=>{e.preventDefault();let wrong=-1;PM.powers(n).forEach((p,i)=>{if(PM.integer(state.powers[i])!==p.exponent){inputs[i].setAttribute('aria-invalid','true');if(wrong<0)wrong=i;}});if(wrong>=0){inputs[wrong].focus();reply('Revisa los exponentes marcados: cada uno indica cuántas veces aparece su primo. No se suman los factores.');return;}state.powersChecked=true;savePrimes();renderPrimePractice();pe('prime-exercise').querySelector('input:not(:disabled)')?.focus();});work.append(form);return;
  }
  const summary=node('div','factor-summary');summary.innerHTML=`<p class="math-line">${n} = ${powerHtml(n)}</p>`;work.append(summary);
  const counts=PM.powers(n).map(p=>p.exponent+1),formula=PM.powers(n).map(p=>`(${p.exponent} + 1)`).join(' · ');
  work.append(node('h5','','¿Cuántos divisores tiene?'),node('p','',`Suma 1 a cada exponente y multiplica: ${formula} = ${counts.join(' · ')}.`));
  const form=document.createElement('form');form.noValidate=true;const fields=node('div','prime-fields');const count=field(fields,'Número total de divisores',state.count,v=>state.count=v,state.solved);form.append(fields);const check=submitButton(form,state.solved?'Resuelto ✓':'Comprobar divisores');check.disabled=state.solved;const reply=feedbackFor(form);
  if(state.solved)reply(`¡Ejercicio completo! ${n} tiene ${PM.divisorCount(n)} divisores. Están incluidos el 1 y el propio ${n}.`,true);
  form.addEventListener('submit',e=>{e.preventDefault();if(state.solved)return;if(PM.integer(state.count)!==PM.divisorCount(n)){markWrong(count);reply(`Revisa la multiplicación ${counts.join(' · ')}. Multiplicamos las opciones; no sumamos los exponentes ni los factores primos.`);return;}state.solved=true;savePrimes();renderPrimePractice();});work.append(form);
}
function renderPrimePractice() {
  const s=primeState.stage,stage=primeStages[s],q=primeState.questions[s],n=stage.numbers[q],state=itemState(s,n);
  pe('prime-levels').replaceChildren();primeStages.forEach((item,i)=>{
    const done=item.numbers.filter(value=>completeItem(i,value,itemState(i,value))).length;
    const b=button(`${item.title} · ${done}/${item.numbers.length}`,()=>{primeState.stage=i;savePrimes();renderPrimePractice();pe('prime-level-title').focus();});if(i===s)b.setAttribute('aria-current','step');pe('prime-levels').append(b);
  });
  pe('prime-level-title').textContent=stage.title;pe('prime-level-help').textContent=stage.help;pe('prime-questions').replaceChildren();
  stage.numbers.forEach((value,i)=>{
    const complete=completeItem(s,value,itemState(s,value));const label=s===2?`${'abcdefgh'[i]}. ${value}`:String(value);
    const b=button(`${label}${complete?' ✓':''}`,()=>{primeState.questions[s]=i;savePrimes();renderPrimePractice();pe('prime-level-title').focus();});b.setAttribute('aria-label',`Ejercicio ${value}${complete?', resuelto':''}`);if(i===q)b.setAttribute('aria-current','step');pe('prime-questions').append(b);
  });
  const target=pe('prime-exercise');target.replaceChildren();target.append(node('p','eyebrow',s===2?`EJERCICIO 52 · APARTADO ${'abcdefgh'[q].toUpperCase()}`:`EJERCICIO ${q+1} DE ${stage.numbers.length}`),node('h4','',s===0?`¿Qué tipo de número es ${n}?`:s===1?`Encuentra el primer paso para ${n}`:`Descompón ${n} en factores primos`));
  if(s===0)renderRecognize(target,n,state);else if(s===1)renderChoose(target,n,state);else renderFactor(target,n,state);
  const hint=node('details','hint'),title=node('summary','','Necesito una pista');let hintText;
  if(s===0)hintText=n===1?'Cuenta cuántos divisores tiene el 1.':n===2?'Escribe todos los divisores de 2.':PM.isPrime(n)?`Prueba los primos cuyo cuadrado no supere ${n}. Si ninguno divide exactamente, solo quedan 1 y ${n}.`:`Busca una división exacta. Prueba el primo ${PM.factors(n)[0]}.`;
  else if(s===1)hintText=`Prueba en orden 2, 3, 5, 7… El primer primo que divida exactamente a ${n} es el que buscamos.`;
  else {let rest=n;state.steps.forEach(step=>rest=step.quotient);hintText=rest!==1?(rest%2===0?`${rest} es par: prueba dividirlo por 2.`:rest%3===0?`Suma las cifras de ${rest}. ¿Es múltiplo de 3? Entonces puedes probar el 3.`:`Prueba 5, 7, 11… Si ${rest} ya es primo, divídelo por sí mismo.`):!state.powersChecked?'Cuenta las repeticiones de cada primo de la columna derecha. Cada cuenta es un exponente.':'A cada exponente le sumas 1. Después multiplicas los resultados, como en 54: (1 + 1) · (3 + 1).';}
  hint.append(title,node('p','',hintText));hint.open=state.hint;hint.addEventListener('toggle',()=>{state.hint=hint.open;savePrimes();});target.append(hint);
  pe('prime-next').hidden=s===2&&q===stage.numbers.length-1;
  pe('prime-next').textContent=q===stage.numbers.length-1?'Siguiente nivel':'Siguiente ejercicio';updatePrimeProgress();
}
restorePrimes();renderLesson();renderPrimePractice();savePrimes();
pe('lesson-prev').addEventListener('click',()=>{if(primeState.lesson>0)primeState.lesson--;savePrimes();renderLesson();});
pe('lesson-next').addEventListener('click',()=>{if(primeState.lesson<3){primeState.lesson++;savePrimes();renderLesson();}else pe('prime-level-title').focus();});
pe('prime-next').addEventListener('click',()=>{const s=primeState.stage;if(primeState.questions[s]<primeStages[s].numbers.length-1)primeState.questions[s]++;else if(s<2)primeState.stage++;savePrimes();renderPrimePractice();pe('prime-level-title').focus();});
pe('prime-reset').addEventListener('click',()=>pe('prime-reset-dialog').showModal());
pe('prime-cancel-reset').addEventListener('click',()=>pe('prime-reset-dialog').close());
pe('prime-confirm-reset').addEventListener('click',()=>{primeState=freshPrimeState();savePrimes();pe('prime-reset-dialog').close();renderLesson();renderPrimePractice();pe('prime-level-title').focus();});
