document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".card-container");

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
      name: "Pound to Kilogram Converter",
      description: "Convert pounds and kilograms instantly.",
      path: "Pound to Kg Converter/index.html",
      available: true,
    },
    {
      name: "Inches to Centimeter Converter",
      description: "Convert inches and centimeters instantly.",
      path: "Inches to Cm Converter/index.html",
      available: true,
    },
    {
      name: "Release Notes",
      description: "Browse release history.",
      path: "Release Notes/index.html",
      available: true,
    },
  ];

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
});