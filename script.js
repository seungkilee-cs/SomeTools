document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector(".card-container");
    const themeCheckbox = document.getElementById("theme-checkbox");
  
    // Array of HTML file names
    const htmlDirectories = ["Convert To UTF-8", "Subtitle Converter"]
    const htmlFiles = htmlDirectories.map(directory => `${directory}/index.html`);
  
    // Generate cards dynamically
    htmlFiles.forEach(function(file) {
      // Remove the "/index.html" part from the file name
      const fileName = file.replace("/index.html", "");     
      const card = document.createElement("div");
      card.classList.add("card");
      card.textContent = fileName;
  
      // Add click event listener to navigate to the selected HTML file
      card.addEventListener("click", function() {
        window.location.href = "html/" + file;
      });
  
      cardContainer.appendChild(card);
    });
  
    // Theme toggle functionality
    themeCheckbox.addEventListener("change", function() {
      if (themeCheckbox.checked) {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    });
  });
  