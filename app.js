'use strict';
// Respuestas guiadas: se comparan enteros, nunca se ejecuta lo que escribe la alumna.
const levels = [
  { title: 'Distributiva con números', tab: '1 · Números', help: 'Multiplica por cada término y calcula el resultado. Los signos ya están puestos.', type: 'numeric', rows: [[3,4,5,'+'],[5,6,2,'+'],[4,10,3,'−'],[7,8,5,'−']] },
  { title: 'Distributiva con letras', tab: '2 · Letras', help: 'Completa el número que acompaña a x y el término independiente. No escribas la x ni el signo.', type: 'letters', rows: [[3,1,4,'+'],[5,1,2,'+'],[4,1,3,'−'],[2,3,5,'+']] },
  { title: 'Factor común con números', tab: '3 · Factor común', help: 'Saca el mayor factor común positivo. Divide los dos términos por ese factor y completa el paréntesis.', type: 'factor', rows: [[12,18,'+'],[20,30,'+'],[24,16,'−'],[18,27,'+']] },
  { title: 'Factor común con letras', tab: '4 · Reto con letras', help: 'Saca el mayor factor numérico común positivo. La x se queda dentro del paréntesis. Si queda x, escribe 1 delante.', type: 'factorLetters', rows: [[5,15,'+'],[8,12,'+'],[18,12,'−'],[14,21,'+']] }
];
const gcd = (a,b) => b ? gcd(b,a%b) : a;
const term = a => a === 1 ? 'x' : `${a}x`;
function describe(level, row) {
  const [a,b,c,sign] = row;
  if (level.type === 'numeric' || level.type === 'letters') {
    const letters = level.type === 'letters';
    const total = sign === '+' ? a*b+a*c : a*b-a*c;
    return { expression: `${a} · (${letters ? term(b) : b} ${sign} ${c})`, answers: letters ? [a*b,a*c] : [a*b,a*c,total], parts: letters ? ['',`x ${sign} `,''] : ['',` ${sign} `,' = ',''], labels: letters ? ['Número de x','Número final'] : ['1.er producto','2.º producto','Resultado'], hint: `Multiplica ${a} por ${b}${letters ? 'x' : ''} y también por ${c}. Conserva el signo ${sign}.`, solution: `${a} · ${letters ? term(b) : b} ${sign} ${a} · ${c} = ${a*b}${letters ? 'x' : ''} ${sign} ${a*c}${letters ? '' : ` = ${total}`}.` };
  }
  const factor = gcd(a,b), letters = level.type === 'factorLetters';
  return { expression: `${a}${letters ? 'x' : ''} ${c} ${b}`, answers: [factor,a/factor,b/factor], parts: ['', ' · (', `${letters ? 'x' : ''} ${c} `,')'], labels: ['Factor','1.er término','2.º término'], hint: `Busca el mayor número que divide exactamente a ${a} y a ${b}. Después divide ambos por él.`, solution: `${a} ÷ ${factor} = ${a/factor} y ${b} ÷ ${factor} = ${b/factor}. Por eso: ${factor} · (${letters ? term(a/factor) : a/factor} ${c} ${b/factor}).` };
}
let current = 0;
let states = levels.map(level => level.rows.map(() => ({ values: [], solved: false, message: '', kind: '', hint: false })));
const $ = id => document.getElementById(id);
function score() { return states.flat().filter(state => state.solved).length; }
function updateProgress() {
  const count = score(), done = states[current].filter(state => state.solved).length;
  $('score').textContent = `${count} / 16`;
  $('progress').value = count;
  $('progress-text').textContent = `${count} de 16 ejercicios resueltos`;
  $('level-done').textContent = `${done} / 4 resueltos`;
  $('encouragement').textContent = count === 16 ? '¡16 de 16! Has completado el entrenamiento. ¡Buen trabajo!' : done === 4 ? '¡Nivel completado! Puedes repasar o seguir practicando.' : 'Sin prisa: piensa, prueba y comprueba.';
  document.querySelectorAll('#levels button').forEach((button,index) => {
    const complete = states[index].every(state => state.solved);
    button.textContent = levels[index].tab + (complete ? ' ✓' : '');
    button.setAttribute('aria-label', `${levels[index].title}${complete ? ', completado' : ''}`);
  });
}
function render() {
  const level = levels[current];
  $('levels').replaceChildren();
  levels.forEach((item,index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = item.tab;
    if (index === current) button.setAttribute('aria-current','step');
    button.addEventListener('click',() => { current = index; render(); $('level-title').focus(); });
    $('levels').append(button);
  });
  $('level-counter').textContent = `NIVEL ${current+1} DE 4`;
  $('level-title').textContent = level.title;
  $('level-help').textContent = level.help;
  $('exercises').replaceChildren();
  level.rows.forEach((row,index) => {
    const item = describe(level,row), state = states[current][index], prefix = `q-${current}-${index}`;
    const form = document.createElement('form'); form.className = 'exercise'; form.noValidate = true;
    form.setAttribute('aria-labelledby',`${prefix}-title`);
    form.innerHTML = `<div class="exercise-top"><span class="exercise-index">${String(current*4+index+1).padStart(2,'0')}</span><span class="expression" id="${prefix}-title">${item.expression} =</span></div><div class="answer-row"><div class="equation"></div><button class="check primary" type="submit">${state.solved ? 'Resuelto ✓' : 'Comprobar'}</button></div><p id="${prefix}-feedback" class="feedback" role="status" aria-live="polite"></p><details class="hint"><summary>Necesito una pista</summary><p>${item.hint}</p></details>`;
    const equation = form.querySelector('.equation');
    item.answers.forEach((_,fieldIndex) => {
      const symbol = document.createElement('span'); symbol.className = 'math-symbol'; symbol.textContent = item.parts[fieldIndex]; equation.append(symbol);
      const label = document.createElement('label'); label.className = 'field';
      const caption = document.createElement('span'); caption.className = 'field-label'; caption.textContent = item.labels[fieldIndex];
      const input = document.createElement('input'); input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off'; input.spellcheck = false; input.maxLength = 8;
      input.setAttribute('aria-describedby',`${prefix}-title ${prefix}-feedback`);
      input.value = state.values[fieldIndex] || ''; input.disabled = state.solved;
      input.addEventListener('input',() => {
        state.values[fieldIndex] = input.value; state.message = ''; state.kind = '';
        feedback.textContent = ''; feedback.className = 'feedback';
        form.querySelectorAll('input').forEach(field => field.removeAttribute('aria-invalid'));
      });
      label.append(caption,input); equation.append(label);
    });
    const last = document.createElement('span'); last.className = 'math-symbol'; last.textContent = item.parts.at(-1); equation.append(last);
    const feedback = form.querySelector('.feedback'); feedback.textContent = state.message; feedback.className = `feedback ${state.kind}`;
    form.querySelector('button').disabled = state.solved;
    const hint = form.querySelector('details'); hint.open = state.hint; hint.addEventListener('toggle',() => { state.hint = hint.open; });
    form.addEventListener('submit',event => {
      event.preventDefault(); if (state.solved) return;
      const inputs = [...form.querySelectorAll('input')];
      const invalid = inputs.find(input => !/^\d+$/.test(input.value.trim()));
      if (invalid) {
        state.message = 'Completa todos los huecos con números enteros positivos o cero. Los signos y las letras ya están puestos.';
        state.kind = 'error'; invalid.setAttribute('aria-invalid','true'); invalid.focus();
      } else {
        const correct = inputs.every((input,i) => Number(input.value.trim()) === item.answers[i]);
        if (correct) {
          state.solved = true; state.kind = 'success'; state.message = `¡Correcto! +1 punto. ${item.solution}`;
          inputs.forEach(input => { input.disabled = true; input.removeAttribute('aria-invalid'); });
          form.querySelector('button').textContent = 'Resuelto ✓'; form.querySelector('button').disabled = true;
        } else {
          state.kind = 'error';
          state.message = level.type.startsWith('factor') && Number(inputs[0].value) !== item.answers[0] ? 'Revisa el factor: buscamos el MAYOR divisor común de ambos números. Usa la pista y vuelve a probar.' : 'Todavía no. Revisa los huecos marcados y vuelve a intentarlo. Puedes abrir la pista; no pierdes puntos.';
          inputs.forEach((input,i) => input.setAttribute('aria-invalid',String(Number(input.value.trim()) !== item.answers[i])));
        }
      }
      feedback.textContent = state.message; feedback.className = `feedback ${state.kind}`; updateProgress();
    });
    $('exercises').append(form);
  });
  $('next').hidden = current === levels.length-1;
  updateProgress();
}
$('next').addEventListener('click',() => { if (current < levels.length-1) current++; render(); $('level-title').focus(); });
$('reset').addEventListener('click',() => $('reset-dialog').showModal());
$('cancel-reset').addEventListener('click',() => $('reset-dialog').close());
$('confirm-reset').addEventListener('click',() => {
  states = levels.map(level => level.rows.map(() => ({ values: [], solved: false, message: '', kind: '', hint: false })));
  current = 0; $('reset-dialog').close(); render(); $('level-title').focus();
});
render();
