'use strict';

const fileInput = document.getElementById('fileInput');
const convertButton = document.getElementById('convertButton');
const selectionSection = document.getElementById('selection');
const selectionList = document.getElementById('selectionList');
const resultsSection = document.getElementById('results');
const resultsList = document.getElementById('resultsList');

if (!fileInput || !convertButton) {
  throw new Error('Subtitle Converter failed to initialize: missing required elements.');
}

fileInput.addEventListener('change', handleSelectionChange);
convertButton.addEventListener('click', () => {
  convertButton.disabled = true;
  processFiles(Array.from(fileInput.files))
    .catch((error) => {
      console.error(error);
      appendResult('Unexpected error during conversion.', 'results__error');
    })
    .finally(() => {
      fileInput.value = '';
      convertButton.disabled = true;
      toggleSection(selectionSection, false);
    });
});

function handleSelectionChange() {
  const files = Array.from(fileInput.files);
  if (files.length === 0) {
    selectionList.innerHTML = '';
    toggleSection(selectionSection, false);
    convertButton.disabled = true;
    return;
  }

  selectionList.innerHTML = '';
  files.forEach((file) => {
    const item = document.createElement('li');
    item.textContent = `${file.name} (${formatBytes(file.size)})`;
    selectionList.appendChild(item);
  });

  toggleSection(selectionSection, true);
  convertButton.disabled = false;
}

async function processFiles(files) {
  if (files.length === 0) {
    return;
  }

  resultsList.innerHTML = '';
  toggleSection(resultsSection, true);

  for (const file of files) {
    try {
      const originalText = await readFileAsText(file);
      const { outputText, outputName } = convertSubtitle(file.name, originalText);
      downloadText(outputText, outputName);
      appendResult(`Converted ${file.name} → ${outputName}`, 'results__success');
    } catch (error) {
      console.error('Failed to convert file', file.name, error);
      appendResult(`Failed ${file.name}: ${error.message}`, 'results__error');
    }
  }
}

function convertSubtitle(fileName, contents) {
  const extension = getExtension(fileName);
  const normalized = normalizeNewlines(contents);

  if (extension === 'srt') {
    const outputText = convertSrtToVtt(normalized);
    return { outputText, outputName: replaceExtension(fileName, 'vtt') };
  }

  if (extension === 'vtt') {
    const outputText = convertVttToSrt(normalized);
    return { outputText, outputName: replaceExtension(fileName, 'srt') };
  }

  throw new Error('Unsupported file extension. Only .srt and .vtt are supported.');
}

function convertSrtToVtt(text) {
  const cueText = text
    .trim()
    .replace(/\r/g, '')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');

  return 'WEBVTT\n\n' + cueText;
}

function convertVttToSrt(text) {
  const lines = text.split('\n');
  const output = [];
  let skippingHeader = true;

  for (const line of lines) {
    if (skippingHeader) {
      if (line.trim() === '' || line.trim().startsWith('WEBVTT')) {
        continue;
      }
      skippingHeader = false;
    }

    if (/^(NOTE|STYLE|REGION)/i.test(line)) {
      continue;
    }

    const convertedLine = line.replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, '$1,$2');
    output.push(convertedLine);
  }

  const result = output.join('\n').trim();
  if (result.length === 0) {
    throw new Error('Input file did not contain valid VTT cues.');
  }

  return result;
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file, 'utf-8');
  });
}

function replaceExtension(fileName, newExt) {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) {
    return `${fileName}.${newExt}`;
  }
  return `${fileName.slice(0, lastDot)}.${newExt}`;
}

function getExtension(fileName) {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }
  return fileName.slice(lastDot + 1).toLowerCase();
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function appendResult(message, className) {
  const item = document.createElement('li');
  item.textContent = message;
  if (className) {
    item.classList.add(className);
  }
  resultsList.appendChild(item);
}

function toggleSection(section, shouldShow) {
  if (!section) {
    return;
  }
  section.hidden = !shouldShow;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`;
}

function downloadText(text, fileName) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 0);
}
