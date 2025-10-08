'use strict';

const inchesInput = document.getElementById('inchesInput');
const centimetersInput = document.getElementById('centimetersInput');
const clearButton = document.getElementById('clearButton');
const status = document.getElementById('status');
const feetInput = document.getElementById('feetInput');
const remainingInchesInput = document.getElementById('remainingInchesInput');
const heightCentimetersInput = document.getElementById('heightCentimetersInput');

if (!inchesInput || !centimetersInput || !clearButton || !feetInput || !remainingInchesInput || !heightCentimetersInput) {
  throw new Error('Inches to Centimeter Converter failed to initialize: required elements are missing.');
}

const INCH_TO_CENTIMETER = 2.54;
const FEET_TO_INCHES = 12;
let internalUpdate = false;

inchesInput.addEventListener('input', () => {
  if (internalUpdate) {
    return;
  }
  const rawValue = inchesInput.value.trim();
  if (rawValue === '') {
    synchronizeFields('', 'inches');
    return;
  }
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    setStatus('Enter a valid inches value.', true);
    return;
  }
  const centimeters = parsed * INCH_TO_CENTIMETER;
  synchronizeFields(centimeters, 'inches');
});

centimetersInput.addEventListener('input', () => {
  if (internalUpdate) {
    return;
  }
  const rawValue = centimetersInput.value.trim();
  if (rawValue === '') {
    synchronizeFields('', 'centimeters');
    return;
  }
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    setStatus('Enter a valid centimeters value.', true);
    return;
  }
  const inches = parsed / INCH_TO_CENTIMETER;
  synchronizeFields(inches, 'centimeters');
});

feetInput.addEventListener('input', handleFeetInchesInput);
remainingInchesInput.addEventListener('input', handleFeetInchesInput);

clearButton.addEventListener('click', () => {
  internalUpdate = true;
  inchesInput.value = '';
  centimetersInput.value = '';
  clearFeetSection();
  internalUpdate = false;
  setStatus('Values cleared.');
  inchesInput.focus();
});

function synchronizeFields(nextValue, source) {
  internalUpdate = true;
  if (nextValue === '') {
    if (source === 'inches') {
      centimetersInput.value = '';
    } else {
      inchesInput.value = '';
    }
    clearFeetSection();
    setStatus('');
    internalUpdate = false;
    return;
  }

  const formatted = formatNumber(nextValue);
  if (source === 'inches') {
    centimetersInput.value = formatted;
    const totalInches = Number.parseFloat(inchesInput.value);
    const summary = updateFeetSectionFromInches(totalInches);
    const centimetersDisplay = summary ? formatNumber(summary.centimeters) : formatted;
    const inchesDisplay = formatNumber(Number.parseFloat(inchesInput.value));
    if (summary) {
      const feetDisplay = formatNumber(summary.feet);
      const remainingDisplay = formatNumber(summary.inches);
      setStatus(`${inchesDisplay} in equals ${centimetersDisplay} cm (${feetDisplay} ft ${remainingDisplay} in).`);
    } else {
      setStatus(`${inchesDisplay} in equals ${centimetersDisplay} cm.`);
    }
  } else {
    inchesInput.value = formatted;
    const totalInches = nextValue;
    const summary = updateFeetSectionFromInches(totalInches);
    const centimetersValue = Number.parseFloat(centimetersInput.value);
    const centimetersDisplay = Number.isNaN(centimetersValue) ? formatNumber(totalInches * INCH_TO_CENTIMETER) : formatNumber(centimetersValue);
    if (summary) {
      const feetDisplay = formatNumber(summary.feet);
      const remainingDisplay = formatNumber(summary.inches);
      setStatus(`${centimetersDisplay} cm equals ${formatted} in (${feetDisplay} ft ${remainingDisplay} in).`);
    } else {
      setStatus(`${centimetersDisplay} cm equals ${formatted} in.`);
    }
  }
  internalUpdate = false;
}

function handleFeetInchesInput() {
  if (internalUpdate) {
    return;
  }

  const feetValue = feetInput.value.trim();
  const inchesValue = remainingInchesInput.value.trim();

  if (feetValue === '' && inchesValue === '') {
    internalUpdate = true;
    inchesInput.value = '';
    centimetersInput.value = '';
    clearFeetSection();
    internalUpdate = false;
    setStatus('');
    return;
  }

  const feet = feetValue === '' ? 0 : Number.parseFloat(feetValue);
  const inches = inchesValue === '' ? 0 : Number.parseFloat(inchesValue);

  if (Number.isNaN(feet) || Number.isNaN(inches)) {
    setStatus('Enter valid feet and inches values.', true);
    return;
  }

  const totalInches = feet * FEET_TO_INCHES + inches;
  const centimeters = totalInches * INCH_TO_CENTIMETER;
  const centimetersDisplay = formatNumber(centimeters);

  internalUpdate = true;
  inchesInput.value = formatNumber(totalInches);
  centimetersInput.value = centimetersDisplay;
  const summary = updateFeetSectionFromInches(totalInches);
  internalUpdate = false;

  if (summary) {
    const feetDisplay = formatNumber(summary.feet);
    const inchesDisplay = formatNumber(summary.inches);
    setStatus(`${feetDisplay} ft ${inchesDisplay} in equals ${centimetersDisplay} cm.`);
  } else {
    setStatus(`${centimetersDisplay} cm.`);
  }
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

function updateFeetSectionFromInches(totalInches) {
  if (!Number.isFinite(totalInches)) {
    clearFeetSection();
    return null;
  }

  const feet = Math.floor(totalInches / FEET_TO_INCHES);
  const inches = totalInches - feet * FEET_TO_INCHES;
  const centimeters = totalInches * INCH_TO_CENTIMETER;

  feetInput.value = formatNumber(feet);
  remainingInchesInput.value = formatNumber(inches);
  heightCentimetersInput.value = formatNumber(centimeters);

  return { feet, inches, centimeters };
}

function clearFeetSection() {
  feetInput.value = '';
  remainingInchesInput.value = '';
  heightCentimetersInput.value = '';
}
