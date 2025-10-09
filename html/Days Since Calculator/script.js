'use strict';

const startDateInput = document.getElementById('startDate');
const calculateButton = document.getElementById('calculateButton');
const clearButton = document.getElementById('clearButton');
const resultCard = document.getElementById('resultCard');
const resultHeading = document.getElementById('resultHeading');
const resultDetails = document.getElementById('resultDetails');
const status = document.getElementById('status');

if (!startDateInput || !calculateButton || !clearButton || !resultCard || !resultHeading || !resultDetails || !status) {
  throw new Error('Days Since Calculator failed to initialize: required elements are missing.');
}

setStatus('');

calculateButton.addEventListener('click', () => {
  const startDateValue = startDateInput.value;
  if (!startDateValue) {
    hideResult();
    setStatus('Select a start date.', true);
    return;
  }

  const today = truncateToDate(new Date());
  const startDate = new Date(startDateValue + 'T00:00:00');
  if (Number.isNaN(startDate.getTime())) {
    hideResult();
    setStatus('Provide a valid date.', true);
    return;
  }

  const diffDays = calculateElapsedDays(startDate, today);
  if (diffDays < 0) {
    hideResult();
    setStatus('Pick a date that is not in the future.', true);
    return;
  }

  renderResult(diffDays, startDate, today);
  setStatus('Calculation updated.');
});

clearButton.addEventListener('click', () => {
  startDateInput.value = '';
  hideResult();
  setStatus('Values cleared.');
  startDateInput.focus();
});

function calculateElapsedDays(startDate, endDate) {
  const millisPerDay = 24 * 60 * 60 * 1000;
  return Math.round((endDate.getTime() - startDate.getTime()) / millisPerDay);
}

function truncateToDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function renderResult(diffDays, startDate, today) {
  resultCard.hidden = false;

  const formattedStart = startDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  const formattedToday = today.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  resultHeading.textContent = `${diffDays} day${diffDays === 1 ? '' : 's'} since`; 
  resultDetails.textContent = `${diffDays} full day${diffDays === 1 ? ' has' : 's have'} passed from ${formattedStart} through ${formattedToday}.`;
}

function hideResult() {
  resultCard.hidden = true;
  resultHeading.textContent = '';
  resultDetails.textContent = '';
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
