document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const cardContainer = document.querySelector(".card-container");
  const themeCheckbox = document.getElementById("theme-checkbox");

  const tools = [
    {
      name: "Convert To UTF-8",
      description: "Convert EUC-KR files to UTF-8.",
      path: "Convert To UTF-8/index.html",
      available: true,
    },
    {
      name: "Subtitle Converter",
      description: "Convert between SRT and VTT subtitle formats.",
      path: "Subtitle Converter/index.html",
      available: true,
    },
    {
      name: "Temperature Converter",
      description: "Convert Fahrenheit and Celsius instantly.",
      path: "Temperature Converter/index.html",
      available: true,
    },
    {
      name: "Release Notes",
      description: "Browse release history.",
      available: false,
    },
  ];

  function updateTheme(isDark) {
    if (isDark) {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }

  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDarkTheme = storedTheme === "dark" || (!storedTheme && prefersDark);
  updateTheme(useDarkTheme);
  themeCheckbox.checked = useDarkTheme;

  tools.forEach(function (tool) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("span");
    title.classList.add("card__title");
    title.textContent = tool.name;

    const description = document.createElement("span");
    description.classList.add("card__description");
    description.textContent = tool.description;

    card.appendChild(title);
    card.appendChild(description);

    if (tool.available && tool.path) {
      card.setAttribute("role", "button");
      card.tabIndex = 0;

      const navigate = function () {
        window.location.href = "html/" + tool.path;
      };

      card.addEventListener("click", navigate);
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate();
        }
      });
    } else {
      card.classList.add("card--disabled");
      card.setAttribute("aria-disabled", "true");

      const status = document.createElement("span");
      status.classList.add("card__status");
      status.textContent = "Coming soon";
      card.appendChild(status);
    }

    cardContainer.appendChild(card);
  });

  themeCheckbox.addEventListener("change", function () {
    updateTheme(themeCheckbox.checked);
  });
});