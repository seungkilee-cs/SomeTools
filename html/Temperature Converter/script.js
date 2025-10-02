'use strict';

const fahrenheitInput = document.getElementById('fahrenheitInput');
const celsiusInput = document.getElementById('celsiusInput');
const clearButton = document.getElementById('clearButton');
const status = document.getElementById('status');

if (!fahrenheitInput || !celsiusInput || !clearButton) {
  throw new Error('Temperature Converter failed to initialize: required elements are missing.');
}

let internalUpdate = false;

fahrenheitInput.addEventListener('input', () => {
  if (internalUpdate) {
    return;
  }
  const rawValue = fahrenheitInput.value.trim();
  if (rawValue === '') {
    synchronizeFields('', 'fahrenheit');
    return;
  }
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    setStatus('Enter a valid Fahrenheit value.', true);
    return;
  }
  const celsius = ((parsed - 32) * 5) / 9;
  synchronizeFields(celsius, 'fahrenheit');
});

celsiusInput.addEventListener('input', () => {
  if (internalUpdate) {
    return;
  }
  const rawValue = celsiusInput.value.trim();
  if (rawValue === '') {
    synchronizeFields('', 'celsius');
    return;
  }
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    setStatus('Enter a valid Celsius value.', true);
    return;
  }
  const fahrenheit = (parsed * 9) / 5 + 32;
  synchronizeFields(fahrenheit, 'celsius');
});

clearButton.addEventListener('click', () => {
  internalUpdate = true;
  fahrenheitInput.value = '';
  celsiusInput.value = '';
  internalUpdate = false;
  setStatus('Values cleared.');
  fahrenheitInput.focus();
});

function synchronizeFields(nextValue, source) {
  internalUpdate = true;
  if (nextValue === '') {
    if (source === 'fahrenheit') {
      celsiusInput.value = '';
    } else {
      fahrenheitInput.value = '';
    }
    setStatus('');
    internalUpdate = false;
    return;
  }

  const formatted = formatNumber(nextValue);
  if (source === 'fahrenheit') {
    celsiusInput.value = formatted;
    setStatus(`${formatNumber(Number.parseFloat(fahrenheitInput.value))} °F equals ${formatted} °C.`);
  } else {
    fahrenheitInput.value = formatted;
    setStatus(`${formatNumber(Number.parseFloat(celsiusInput.value))} °C equals ${formatted} °F.`);
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
