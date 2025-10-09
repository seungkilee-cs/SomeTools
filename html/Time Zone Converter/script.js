'use strict';

const dateTimeInput = document.getElementById('dateTimeInput');
const sourceTimeZoneSelect = document.getElementById('sourceTimeZone');
const targetTimeZoneSelect = document.getElementById('targetTimeZone');
const convertButton = document.getElementById('convertButton');
const swapButton = document.getElementById('swapButton');
const resultCard = document.getElementById('resultCard');
const sourceSummary = document.getElementById('sourceSummary');
const targetSummary = document.getElementById('targetSummary');
const status = document.getElementById('status');

if (!dateTimeInput || !sourceTimeZoneSelect || !targetTimeZoneSelect || !convertButton || !swapButton || !resultCard || !sourceSummary || !targetSummary || !status) {
  throw new Error('Time Zone Converter failed to initialize: required elements are missing.');
}

const timeZones = getSupportedTimeZones();
populateTimeZoneSelect(sourceTimeZoneSelect, timeZones);
populateTimeZoneSelect(targetTimeZoneSelect, timeZones);

initializeDefaultSelections();
setStatus('');

convertButton.addEventListener('click', () => {
  const dateTimeValue = dateTimeInput.value;
  if (!dateTimeValue) {
    hideResult();
    setStatus('Select a date and time to convert.', true);
    return;
  }

  const sourceZone = sourceTimeZoneSelect.value;
  const targetZone = targetTimeZoneSelect.value;

  try {
    const instant = convertToInstant(dateTimeValue, sourceZone);
    const sourceDisplay = formatZonedDateTime(instant, sourceZone);
    const targetDisplay = formatZonedDateTime(instant, targetZone);

    sourceSummary.textContent = sourceDisplay;
    targetSummary.textContent = targetDisplay;

    resultCard.hidden = false;
    setStatus('Conversion updated.');
  } catch (error) {
    hideResult();
    setStatus(error.message || 'Unable to convert time zones.', true);
  }
});

swapButton.addEventListener('click', () => {
  const sourceValue = sourceTimeZoneSelect.value;
  sourceTimeZoneSelect.value = targetTimeZoneSelect.value;
  targetTimeZoneSelect.value = sourceValue;

  if (dateTimeInput.value) {
    convertButton.click();
  }
});

function initializeDefaultSelections() {
  const systemZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timeZones.includes(systemZone)) {
    sourceTimeZoneSelect.value = systemZone;
  }
  targetTimeZoneSelect.value = 'UTC';
}

function populateTimeZoneSelect(selectElement, zones) {
  selectElement.innerHTML = '';
  zones.forEach((zone) => {
    const option = document.createElement('option');
    option.value = zone;
    option.textContent = zone;
    selectElement.appendChild(option);
  });
}

function hideResult() {
  resultCard.hidden = true;
  sourceSummary.textContent = '';
  targetSummary.textContent = '';
}

function parseDateTimeValue(value) {
  const [datePart, timePart] = value.split('T');
  if (!datePart || !timePart) {
    throw new Error('Invalid date/time format.');
  }
  const [year, month, day] = datePart.split('-').map((segment) => Number.parseInt(segment, 10));
  const [hour, minute, second = '0'] = timePart.split(':');

  if ([year, month, day].some((segment) => Number.isNaN(segment))) {
    throw new Error('Invalid date components.');
  }

  const hourNumber = Number.parseInt(hour, 10);
  const minuteNumber = Number.parseInt(minute, 10);
  const secondNumber = Number.parseInt(second, 10);

  if ([hourNumber, minuteNumber, secondNumber].some((segment) => Number.isNaN(segment))) {
    throw new Error('Invalid time components.');
  }

  return {
    year,
    month,
    day,
    hour: hourNumber,
    minute: minuteNumber,
    second: secondNumber,
  };
}

function convertToInstant(dateTimeValue, timeZone) {
  const parts = parseDateTimeValue(dateTimeValue);
  const desiredLocalMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);

  const firstGuess = new Date(desiredLocalMs);
  const adjusted = alignGuessToTimeZone(firstGuess, desiredLocalMs, timeZone);
  const finalAlignment = alignGuessToTimeZone(adjusted, desiredLocalMs, timeZone);

  return finalAlignment;
}

function alignGuessToTimeZone(candidateDate, desiredLocalMs, timeZone) {
  const actualLocalMs = getEquivalentLocalMs(candidateDate, timeZone);
  const delta = desiredLocalMs - actualLocalMs;
  if (delta === 0) {
    return candidateDate;
  }
  return new Date(candidateDate.getTime() + delta);
}

const timeZoneFormatterCache = new Map();

function getFormatter(timeZone) {
  if (!timeZoneFormatterCache.has(timeZone)) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    timeZoneFormatterCache.set(timeZone, formatter);
  }
  return timeZoneFormatterCache.get(timeZone);
}

function getEquivalentLocalMs(date, timeZone) {
  const formatter = getFormatter(timeZone);
  const parts = formatter.formatToParts(date);
  const values = Object.create(null);
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }

  return Date.UTC(
    Number.parseInt(values.year, 10),
    Number.parseInt(values.month, 10) - 1,
    Number.parseInt(values.day, 10),
    Number.parseInt(values.hour, 10),
    Number.parseInt(values.minute, 10),
    Number.parseInt(values.second, 10),
  );
}

function formatZonedDateTime(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
  return formatter.format(date);
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

function getSupportedTimeZones() {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone');
  }
  return [
    'UTC',
    'Etc/GMT',
    'Etc/GMT+1',
    'Etc/GMT-1',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Sao_Paulo',
    'Africa/Johannesburg',
  ];
}
