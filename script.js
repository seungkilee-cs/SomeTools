document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".card-container");
  const searchInput = document.getElementById("toolSearch");
  const toolCount = document.getElementById("toolCount");
  const emptyState = document.getElementById("emptyState");

  if (!cardContainer) {
    throw new Error("Landing page failed to initialize: missing card container.");
  }

  const tools = [
    {
      name: "Convert To UTF-8",
      description: "Convert EUC-KR files to UTF-8.",
      path: "Convert To UTF-8/index.html",
      available: true,
      icon: "🗂️",
    },
    {
      name: "Subtitle Converter",
      description: "Convert between SRT and VTT subtitle formats.",
      path: "Subtitle Converter/index.html",
      available: true,
      icon: "🎬",
    },
    {
      name: "Temperature Converter",
      description: "Convert Fahrenheit and Celsius instantly.",
      path: "Temperature Converter/index.html",
      available: true,
      icon: "🌡️",
    },
    {
      name: "Pound to Kilogram Converter",
      description: "Convert pounds and kilograms instantly.",
      path: "Pound to Kg Converter/index.html",
      available: true,
      icon: "⚖️",
    },
    {
      name: "Inches to Centimeter Converter",
      description: "Convert inches and centimeters instantly.",
      path: "Inches to Cm Converter/index.html",
      available: true,
      icon: "📏",
    },
    {
      name: "Time Zone Converter",
      description: "Convert a date and time between global time zones.",
      path: "Time Zone Converter/index.html",
      available: true,
      icon: "🕰️",
    },
    {
      name: "D-Day Calculator",
      description: "Count days remaining until your target date.",
      path: "D-Day Calculator/index.html",
      available: true,
      icon: "📅",
    },
    {
      name: "Days Since Calculator",
      description: "See how many days have passed since a past event.",
      path: "Days Since Calculator/index.html",
      available: true,
      icon: "⏳",
    },
    {
      name: "Release Notes",
      description: "Browse release history.",
      path: "Release Notes/index.html",
      available: true,
      icon: "📝",
    },
  ];

  renderCards(tools);
  updateToolList(tools.length, "");

  if (searchInput) {
    const handleInput = () => {
      const query = searchInput.value.trim().toLowerCase();
      const filteredTools = query
        ? tools.filter((tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query)
          )
        : tools;

      renderCards(filteredTools);
      updateToolList(filteredTools.length, query);
    };

    searchInput.addEventListener("input", handleInput);
  }

  function createCard(tool) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.classList.add("card__header");

    if (tool.icon) {
      const icon = document.createElement("span");
      icon.classList.add("card__icon");
      icon.textContent = tool.icon;
      icon.setAttribute("aria-hidden", "true");
      header.appendChild(icon);
    }

    const title = document.createElement("span");
    title.classList.add("card__title");
    title.textContent = tool.name;
    header.appendChild(title);

    const description = document.createElement("span");
    description.classList.add("card__description");
    description.textContent = tool.description;

    card.appendChild(header);
    card.appendChild(description);

    if (tool.available && tool.path) {
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

    card.dataset.name = tool.name.toLowerCase();
    card.dataset.description = tool.description.toLowerCase();

    return card;
  }

  function renderCards(list) {
    cardContainer.innerHTML = "";
    list.forEach((tool) => {
      const card = createCard(tool);
      cardContainer.appendChild(card);
    });
  }

  function updateToolList(visibleCount, query = "") {
    if (toolCount) {
      const baseMessage = `${visibleCount} tool${visibleCount === 1 ? "" : "s"}`;
      toolCount.textContent = query ? `${baseMessage} found` : `${baseMessage} available`;
    }

    if (emptyState) {
      const noResults = visibleCount === 0;
      emptyState.hidden = !noResults;
      emptyState.setAttribute("aria-hidden", String(!noResults));
    }
  }
});