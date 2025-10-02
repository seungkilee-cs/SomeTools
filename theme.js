(function () {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  function getStoredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return null;
  }

  function prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }

  function setTheme(mode) {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }

  function initializeToggle(checkbox) {
    if (!checkbox) {
      return;
    }

    checkbox.addEventListener('change', function () {
      setTheme(checkbox.checked ? 'dark' : 'light');
    });
  }

  function initialize(checkbox) {
    const storedTheme = getStoredTheme();
    const defaultTheme = storedTheme || (prefersDarkMode() ? 'dark' : 'light');

    applyTheme(defaultTheme);

    if (checkbox) {
      checkbox.checked = defaultTheme === 'dark';
      initializeToggle(checkbox);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('theme-checkbox');
    initialize(checkbox);
  });

  window.ThemeManager = {
    init: initialize,
    setTheme,
  };
})();
