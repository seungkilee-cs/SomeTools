'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const versionSelect = document.getElementById('versionSelect');
  const languageSelect = document.getElementById('languageSelect');
  const statusEl = document.getElementById('status');
  const notesContent = document.getElementById('notesContent');

  if (!versionSelect || !languageSelect || !statusEl || !notesContent) {
    throw new Error('Release Notes tool failed to initialize: required elements are missing.');
  }

  const releases = [
    {
      version: '0.0.1',
      languages: {
        en: {
          label: 'English',
          path: '../../release/0.0.1.md',
        },
        ko: {
          label: '한국어',
          path: '../../release/0.0.1.ko.md',
        },
      },
    },
  ];

  populateVersionSelect(releases, versionSelect);
  applyLanguageOptions(getSelectedRelease(), languageSelect);
  languageSelect.value = 'en';
  loadSelectedNotes();

  versionSelect.addEventListener('change', () => {
    applyLanguageOptions(getSelectedRelease(), languageSelect);
    loadSelectedNotes();
  });

  languageSelect.addEventListener('change', () => {
    loadSelectedNotes();
  });

  function getSelectedRelease() {
    const version = versionSelect.value;
    return releases.find((entry) => entry.version === version) ?? releases[0];
  }

  async function loadSelectedNotes() {
    const release = getSelectedRelease();
    const languageCode = languageSelect.value;
    const language = release.languages[languageCode];

    if (!language) {
      setStatus(`Language "${languageCode}" is not available for v${release.version}.`, true);
      notesContent.innerHTML = '';
      return;
    }

    setStatus(`Loading v${release.version} (${language.label})…`);

    try {
      const response = await fetch(language.path);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const markdown = await response.text();
      notesContent.innerHTML = renderMarkdown(markdown);
      setStatus(`Showing v${release.version} (${language.label}).`);
    } catch (error) {
      console.error('Failed to load release notes.', error);
      notesContent.innerHTML = '';
      setStatus('Unable to load release notes. Please try another version or language.', true);
    }
  }

  function populateVersionSelect(data, select) {
    select.innerHTML = '';
    data
      .slice()
      .sort((a, b) => compareVersions(b.version, a.version))
      .forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.version;
        option.textContent = `v${entry.version}`;
        select.appendChild(option);
      });
  }

  function applyLanguageOptions(release, select) {
    select.innerHTML = '';

    if (!release) {
      return;
    }

    Object.entries(release.languages).forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.label;
      select.appendChild(option);
    });
  }

  function compareVersions(a, b) {
    const parse = (version) => version.split('.').map((segment) => Number.parseInt(segment, 10) || 0);
    const [aMajor, aMinor, aPatch] = parse(a);
    const [bMajor, bMinor, bPatch] = parse(b);

    if (aMajor !== bMajor) {
      return aMajor - bMajor;
    }
    if (aMinor !== bMinor) {
      return aMinor - bMinor;
    }
    return aPatch - bPatch;
  }

  function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle('status--active', Boolean(message) && !isError);
    statusEl.classList.toggle('status--error', Boolean(message) && isError);
    if (isError) {
      statusEl.setAttribute('role', 'alert');
    } else {
      statusEl.removeAttribute('role');
    }
  }

  function renderMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const html = [];
    let inList = false;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      if (trimmed === '') {
        if (inList) {
          html.push('</ul>');
          inList = false;
        }
        html.push('');
        continue;
      }

      const headingMatch = /^#{1,6}\s+(.*)$/.exec(trimmed);
      if (headingMatch) {
        if (inList) {
          html.push('</ul>');
          inList = false;
        }
        const level = Math.min(headingMatch[0].indexOf(' '), 6);
        const content = formatInline(escapeHtml(headingMatch[1]));
        html.push(`<h${level}>${content}</h${level}>`);
        continue;
      }

      const listMatch = /^[-*+]\s+(.*)$/.exec(trimmed);
      if (listMatch) {
        if (!inList) {
          html.push('<ul>');
          inList = true;
        }
        const content = formatInline(escapeHtml(listMatch[1]));
        html.push(`<li>${content}</li>`);
        continue;
      }

      if (inList) {
        html.push('</ul>');
        inList = false;
      }

      html.push(`<p>${formatInline(escapeHtml(trimmed))}</p>`);
    }

    if (inList) {
      html.push('</ul>');
    }

    return html.join('\n');
  }

  function formatInline(text) {
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
