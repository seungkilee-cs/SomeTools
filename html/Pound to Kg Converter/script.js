'use strict';

const poundsInput = document.getElementById('poundsInput');
const kilogramsInput = document.getElementById('kilogramsInput');
const clearButton = document.getElementById('clearButton');
const status = document.getElementById('status');

if (!poundsInput || !kilogramsInput || !clearButton) {
  throw new Error('Pound to Kilogram Converter failed to initialize: required elements are missing.');
}

const POUND_TO_KILOGRAM = 0.45359237;
let internalUpdate = false;

poundsInput.addEventListener('input', () => {
  if (internalUpdate) {
    return;
  }
  const rawValue = poundsInput.value.trim();
  if (rawValue === '') {
    synchronizeFields('', 'pounds');
    return;
  }
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    setStatus('Enter a valid pounds value.', true);
    return;
  }
  const kilograms = parsed * POUND_TO_KILOGRAM;
  synchronizeFields(kilograms, 'pounds');
});

kilogramsInput.addEventListener('input', () => {
  if (internalUpdate) {
    return;
  }
  const rawValue = kilogramsInput.value.trim();
  if (rawValue === '') {
    synchronizeFields('', 'kilograms');
    return;
  }
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    setStatus('Enter a valid kilograms value.', true);
    return;
  }
  const pounds = parsed / POUND_TO_KILOGRAM;
  synchronizeFields(pounds, 'kilograms');
});

clearButton.addEventListener('click', () => {
  internalUpdate = true;
  poundsInput.value = '';
  kilogramsInput.value = '';
  internalUpdate = false;
  setStatus('Values cleared.');
  poundsInput.focus();
});

function synchronizeFields(nextValue, source) {
  internalUpdate = true;
  if (nextValue === '') {
    if (source === 'pounds') {
      kilogramsInput.value = '';
    } else {
      poundsInput.value = '';
    }
    setStatus('');
    internalUpdate = false;
    return;
  }

  const formatted = formatNumber(nextValue);
  if (source === 'pounds') {
    kilogramsInput.value = formatted;
    setStatus(`${formatNumber(Number.parseFloat(poundsInput.value))} lb equals ${formatted} kg.`);
  } else {
    poundsInput.value = formatted;
    setStatus(`${formatNumber(Number.parseFloat(kilogramsInput.value))} kg equals ${formatted} lb.`);
  }
  internalUpdate = false;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '';
  }
  const rounded = Math.round(value * 100) / 100;
  return rounded.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)[0]+$/, '$1');
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('status--active', Boolean(message) && !isError);
  status.classList.toggle('status--error', Boolean(message) && isError);
  if (isError) {
    status.setAttribute('role', 'alert');
  } else {
    status.removeAttribute('role');
  }
}
