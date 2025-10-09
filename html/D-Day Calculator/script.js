'use strict';

const targetDateInput = document.getElementById('targetDate');
const calculateButton = document.getElementById('calculateButton');
const clearButton = document.getElementById('clearButton');
const resultCard = document.getElementById('resultCard');
const resultHeading = document.getElementById('resultHeading');
const resultDetails = document.getElementById('resultDetails');
const status = document.getElementById('status');

if (!targetDateInput || !calculateButton || !clearButton || !resultCard || !resultHeading || !resultDetails || !status) {
  throw new Error('D-Day Calculator failed to initialize: required elements are missing.');
}

setStatus('');

calculateButton.addEventListener('click', () => {
  const dateValue = targetDateInput.value;
  if (!dateValue) {
    hideResult();
    setStatus('Select a target date.', true);
    return;
  }

  const today = truncateToDate(new Date());
  const targetDate = new Date(dateValue + 'T00:00:00');
  if (Number.isNaN(targetDate.getTime())) {
    hideResult();
    setStatus('Provide a valid date.', true);
    return;
  }

  const diffDays = calculateDayDifference(today, targetDate);

  renderResult(diffDays, today, targetDate);
  setStatus('Countdown updated.');
});

clearButton.addEventListener('click', () => {
  targetDateInput.value = '';
  hideResult();
  setStatus('Values cleared.');
  targetDateInput.focus();
});

function calculateDayDifference(startDate, targetDate) {
  const millisPerDay = 24 * 60 * 60 * 1000;
  return Math.round((targetDate.getTime() - startDate.getTime()) / millisPerDay);
}

function truncateToDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function renderResult(diffDays, today, targetDate) {
  resultCard.hidden = false;

  const formattedToday = today.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  const formattedTarget = targetDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  if (diffDays === 0) {
    resultHeading.textContent = 'It\'s D-Day!';
    resultDetails.textContent = `Today (${formattedToday}) is your target date.`;
    return;
  }

  const prefix = diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  resultHeading.textContent = prefix;

  if (diffDays > 0) {
    resultDetails.textContent = `${diffDays} day${diffDays === 1 ? '' : 's'} remaining until ${formattedTarget}.`;
  } else {
    const elapsed = Math.abs(diffDays);
    resultDetails.textContent = `${elapsed} day${elapsed === 1 ? '' : 's'} have passed since ${formattedTarget}.`;
  }
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
