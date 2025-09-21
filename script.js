function toCelsius(value, unit){
  value = Number(value);
  switch(unit){
    case 'c': return value;
    case 'f': return (value - 32) * 5/9;
    case 'k': return value - 273.15;
    case 'r': return value * 1.25;
    default: return NaN;
  }
}
function fromCelsius(c, unit){
  switch(unit){
    case 'c': return c;
    case 'f': return (c * 9/5) + 32;
    case 'k': return c + 273.15;
    case 'r': return c * 4/5;
    default: return NaN;
  }
}

const valueEl = document.getElementById('value');
const fromEl = document.getElementById('fromUnit');
const toEl = document.getElementById('toUnit');
const resultEl = document.getElementById('result');
const detailEl = document.getElementById('detail');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const precision = document.getElementById('precision');
const precisionText = document.getElementById('precisionText');
const mercury = document.getElementById('mercury');

function formatNumber(v, p){ return Number(v).toFixed(p); }

function unitSuffix(u){
  switch(u){case 'c': return '°C';case 'f': return '°F';case 'k': return 'K';case 'r': return '°Ré';}
}

function mapRange(v, a, b, A, B){ return A + (v - a) * (B - A) / (b - a); }

function animateMercury(h){ mercury.style.height = h + 'px'; }

function convert(){
  const raw = valueEl.value.trim();
  if(raw === ''){ resultEl.textContent = '—'; detailEl.textContent = 'Please enter a number.'; return; }
  const v = Number(raw);
  if(Number.isNaN(v)){ resultEl.textContent = '—'; detailEl.textContent = 'Invalid number.'; return; }

  const c = toCelsius(v, fromEl.value);
  const out = fromCelsius(c, toEl.value);
  const p = Number(precision.value);

  resultEl.textContent = formatNumber(out, p) + ' ' + unitSuffix(toEl.value);
  detailEl.textContent = `${v} ${unitSuffix(fromEl.value)} → ${formatNumber(c, p)} °C`;

  const clamped = Math.max(-50, Math.min(150, c));
  const height = mapRange(clamped, -50, 150, 6, 150);
  animateMercury(height);
}

convertBtn.addEventListener('click', convert);
swapBtn.addEventListener('click', ()=>{ [fromEl.value, toEl.value] = [toEl.value, fromEl.value]; convert(); });
clearBtn.addEventListener('click', ()=>{ valueEl.value=''; resultEl.textContent='—'; detailEl.textContent='Enter a value and press Convert'; animateMercury(60); });
precision.addEventListener('input', ()=>{ precisionText.textContent = precision.value; convert(); });

document.querySelectorAll('button.ghost[data-val]').forEach(b => {
  b.addEventListener('click', function(){
    valueEl.value = this.dataset.val;
    fromEl.value = this.dataset.from;
    toEl.value = this.dataset.to;
    convert();
  });
});

window.addEventListener('load', convert);
