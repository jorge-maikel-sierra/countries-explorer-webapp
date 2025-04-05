// Variable global para almacenar los países
let allCountries = [];

// Función para cambiar entre modo claro y oscuro
function darkMode() {
  const element = document.body;
  const modeText = document.getElementById("modeText");
  const modeIcon = document.getElementById("modeIcon");

  element.classList.toggle("dark-mode");

  // Actualizar el texto y el icono según el modo
  if (element.classList.contains("dark-mode")) {
    modeText.textContent = "Light Mode";
    modeIcon.innerHTML = "☀️";
  } else {
    modeText.textContent = "Dark Mode";
    modeIcon.innerHTML = "🌙";
  }

  // Guardar la preferencia en localStorage
  localStorage.setItem("darkMode", element.classList.contains("dark-mode"));
}

// Función para cargar datos de países desde el archivo JSON
async function fetchData() {
  try {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    allCountries = data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Función para mostrar los países en la interfaz
function displayData(countries) {
  // Obtener el contenedor donde se mostrarán los países
  const container = document.getElementById("countries-container");

  // Verificar si el contenedor existe
  if (!container) {
    console.error(
      "El elemento con id 'countries-container' no se encontró en el DOM"
    );
    return;
  }

  // Limpiar el contenedor antes de agregar nuevos países
  container.innerHTML = "";

  // Verificar si hay países para mostrar
  if (!countries || countries.length === 0) {
    container.innerHTML =
      "<p class='no-results'>No se encontraron países que coincidan con la búsqueda</p>";
    return;
  }

  // Mostrar el número de resultados
  const resultCount = document.createElement("div");
  resultCount.className = "result-count";
  resultCount.textContent = `Mostrando ${countries.length} país(es)`;
  container.appendChild(resultCount);

  // Crear un contenedor para las tarjetas de países
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards-container";
  container.appendChild(cardsContainer);

  // Crear un elemento para cada país y agregarlo al contenedor
  countries.forEach((country) => {
    // Crear el elemento contenedor para el país
    const countryElement = document.createElement("div");
    countryElement.className = "country-card";
    // Añadir atributo de datos para identificar el país
    countryElement.dataset.countryName = country.name || "unknown";

    // Hacer que la tarjeta sea clickeable
    countryElement.addEventListener("click", () => openCountryModal(country));

    // Obtener las banderas (si están disponibles)
    const flagUrl = country.flags?.svg || country.flags?.png || "";
    const flag = flagUrl
      ? `<img src="${flagUrl}" alt="Bandera de ${country.name}" class="country-flag" loading="lazy">`
      : "<div class='no-flag'>No flag available</div>";

    // Obtener los idiomas (si están disponibles)
    let languages = "No disponible";
    if (country.languages) {
      if (Array.isArray(country.languages)) {
        // Si languages es un array de objetos con propiedad name
        languages = country.languages
          .filter((lang) => lang && lang.name)
          .map((lang) => lang.name)
          .join(", ");
      } else if (typeof country.languages === "object") {
        // Si languages es un objeto (formato común en la API Rest Countries v3)
        languages = Object.values(country.languages).join(", ");
      }
    }

    // Dar formato a la población
    const population = country.population
      ? new Intl.NumberFormat().format(country.population)
      : "No disponible";

    // Crear el HTML para el país
    countryElement.innerHTML = `
      <div class="country-header">
        ${flag}
        <h2>${country.name || "País desconocido"}</h2>
      </div>
      <div class="country-info">
        <p><strong>Capital:</strong> ${country.capital || "No disponible"}</p>
        <p><strong>Región:</strong> ${country.region || "No disponible"}</p>
        <p><strong>Subregión:</strong> ${
          country.subregion || "No disponible"
        }</p>
        <p><strong>Población:</strong> ${population}</p>
        <p><strong>Idiomas:</strong> ${languages}</p>
      </div>
    `;

    // Agregar el país al contenedor
    cardsContainer.appendChild(countryElement);
  });
}

// Función para crear y abrir el modal con datos del país
function openCountryModal(country) {
  // Verificar que country sea un objeto válido
  if (!country) {
    console.error("No se proporcionaron datos del país");
    return;
  }

  // Crear modal si no existe
  let modal = document.getElementById("country-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "country-modal";
    modal.className = "modal";
    document.body.appendChild(modal);
  }

  // Obtener las banderas (si están disponibles)
  const flagUrl = country.flags?.svg || country.flags?.png || "";
  const flag = flagUrl
    ? `<img src="${flagUrl}" alt="Bandera de ${country.name}" class="country-flag-large">`
    : "<div class='no-flag-large'>No flag available</div>";

  // Dar formato a la población
  const population = country.population
    ? new Intl.NumberFormat().format(country.population)
    : "No disponible";

  // Obtener los idiomas (si están disponibles)
  let languages = "No disponible";
  if (country.languages) {
    if (Array.isArray(country.languages)) {
      languages = country.languages
        .filter((lang) => lang && lang.name)
        .map((lang) => lang.name)
        .join(", ");
    } else if (typeof country.languages === "object") {
      languages = Object.values(country.languages).join(", ");
    }
  }

  // Obtener monedas (si están disponibles)
  let currencies = "No disponible";
  if (country.currencies) {
    if (Array.isArray(country.currencies)) {
      currencies = country.currencies
        .filter((curr) => curr && curr.name)
        .map((curr) => `${curr.name} (${curr.symbol || "N/A"})`)
        .join(", ");
    } else if (typeof country.currencies === "object") {
      currencies = Object.values(country.currencies)
        .map(
          (curr) =>
            `${curr.name || ""} ${curr.symbol ? `(${curr.symbol})` : ""}`
        )
        .join(", ");
    }
  }

  // Obtener zonas horarias (si están disponibles)
  const timezones = country.timezones
    ? country.timezones.join(", ")
    : "No disponible";

  // Obtener fronteras con otros países (si están disponibles)
  const borders =
    country.borders && country.borders.length > 0
      ? country.borders.join(", ")
      : "No tiene fronteras o es una isla";

  // Crear contenido del modal
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="modal-header">
        ${flag}
        <h2>${country.name || "País desconocido"}</h2>
      </div>
      <div class="modal-body">
        <div class="info-section">
          <h3>Información General</h3>
          <p><strong>Capital:</strong> ${country.capital || "No disponible"}</p>
          <p><strong>Región:</strong> ${country.region || "No disponible"}</p>
          <p><strong>Subregión:</strong> ${
            country.subregion || "No disponible"
          }</p>
          <p><strong>Población:</strong> ${population}</p>
          <p><strong>Área:</strong> ${
            country.area
              ? `${new Intl.NumberFormat().format(country.area)} km²`
              : "No disponible"
          }</p>
        </div>
        
        <div class="info-section">
          <h3>Idiomas y Moneda</h3>
          <p><strong>Idiomas:</strong> ${languages}</p>
          <p><strong>Monedas:</strong> ${currencies}</p>
          <p><strong>Zonas Horarias:</strong> ${timezones}</p>
        </div>
        
        <div class="info-section">
          <h3>Ubicación</h3>
          <p><strong>Continente:</strong> ${
            country.region || "No disponible"
          }</p>
          <p><strong>Países Fronterizos:</strong> ${borders}</p>
          ${
            country.latlng && country.latlng.length >= 2
              ? `<p><strong>Coordenadas:</strong> Lat: ${country.latlng[0]}, Long: ${country.latlng[1]}</p>`
              : ""
          }
        </div>
        
        ${
          country.flags && country.flags.svg
            ? `<div class="info-section">
            <h3>Enlaces</h3>
            <p><a href="${country.flags.svg}" target="_blank">Ver bandera en alta resolución</a></p>
          </div>`
            : ""
        }
      </div>
    </div>
  `;

  // Mostrar el modal
  modal.style.display = "block";

  // Configurar el cierre del modal
  const closeButton = modal.querySelector(".close-modal");
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Cerrar al hacer clic fuera del contenido del modal
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Manejar tecla Escape para cerrar
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

// Función para cerrar el modal
function closeModal() {
  const modal = document.getElementById("country-modal");
  if (modal) {
    modal.style.display = "none";
  }

  // Eliminar event listeners específicos del modal
  document.removeEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

// Función para manejar la búsqueda
function handleSearch() {
  const searchBar = document.getElementById("searchBar");
  if (!searchBar) {
    console.error("Elemento searchBar no encontrado");
    return;
  }

  const searchTerm = searchBar.value.toLowerCase().trim();

  // Verificar que allCountries sea un array
  if (!Array.isArray(allCountries)) {
    console.error("No hay datos de países disponibles");
    return;
  }

  // Si el término de búsqueda está vacío, mostrar todos los países
  if (searchTerm === "") {
    displayData(allCountries);
    return;
  }

  const filteredCountries = allCountries.filter((country) => {
    // Verificar que country sea un objeto válido
    if (!country) return false;

    // Buscar en múltiples campos con verificaciones de existencia
    return (
      (country.name && country.name.toLowerCase().includes(searchTerm)) ||
      (country.capital && country.capital.toLowerCase().includes(searchTerm)) ||
      (country.region && country.region.toLowerCase().includes(searchTerm)) ||
      (country.subregion &&
        country.subregion.toLowerCase().includes(searchTerm)) ||
      (country.population &&
        country.population.toString().includes(searchTerm)) ||
      (country.languages &&
        Array.isArray(country.languages) &&
        country.languages.some(
          (lang) =>
            lang && lang.name && lang.name.toLowerCase().includes(searchTerm)
        ))
    );
  });

  // Mostrar los países filtrados
  displayData(filteredCountries);
}

// Función para inicializar la aplicación con un debounce para la búsqueda
async function init() {
  // Cargar preferencia de modo oscuro
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    const modeText = document.getElementById("modeText");
    const modeIcon = document.getElementById("modeIcon");
    if (modeText) modeText.textContent = "Light Mode";
    if (modeIcon) modeIcon.innerHTML = "☀️";
  }

  // Cargar los datos de países
  const countries = await fetchData();

  if (countries && countries.length > 0) {
    displayData(countries);

    // Configurar el evento de búsqueda con debounce
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
      // Implementación simple de debounce
      let debounceTimeout;
      searchBar.addEventListener("input", function () {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(handleSearch, 300);
      });
    }

    // Configurar el botón de modo oscuro
    const darkModeButton = document.getElementById("darkModeButton");
    if (darkModeButton) {
      darkModeButton.addEventListener("click", darkMode);
    }
  } else {
    console.error("No se pudieron cargar los datos de países");
    const container = document.getElementById("countries-container");
    if (container) {
      container.innerHTML =
        "<p class='error-message'>Error al cargar los datos. Por favor, intenta más tarde.</p>";
    }
  }

  // Agregar estilos para el modal
  addModalStyles();
}

// Función para agregar estilos CSS para el modal
function addModalStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    /* Estilos para el modal */
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.7);
      animation: fadeIn 0.3s;
    }
    
    .modal-content {
      position: relative;
      background-color: #fefefe;
      margin: 5% auto;
      padding: 20px;
      border-radius: 8px;
      width: 80%;
      max-width: 800px;
      max-height: 85vh;
      overflow-y: auto;
      animation: slideIn 0.4s;
    }
    
    /* Estilos para modo oscuro */
    .dark-mode .modal-content {
      background-color: #333;
      color: #fff;
    }
    
    .close-modal {
      position: absolute;
      top: 15px;
      right: 25px;
      color: #aaa;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .close-modal:hover {
      color: #555;
    }
    
    .dark-mode .close-modal:hover {
      color: #ccc;
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
    }
    
    .dark-mode .modal-header {
      border-bottom: 1px solid #555;
    }
    
    .modal-header h2 {
      margin-left: 20px;
      margin-bottom: 0;
    }
    
    .country-flag-large {
      width: 120px;
      height: auto;
      object-fit: contain;
      border: 1px solid #ddd;
    }
    
    .dark-mode .country-flag-large {
      border: 1px solid #555;
    }
    
    .no-flag-large {
      width: 120px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f0f0f0;
      color: #666;
      font-size: 12px;
      text-align: center;
      border: 1px solid #ddd;
    }
    
    .dark-mode .no-flag-large {
      background-color: #444;
      color: #ccc;
      border: 1px solid #555;
    }
    
    .modal-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    @media (max-width: 768px) {
      .modal-body {
        grid-template-columns: 1fr;
      }
    }
    
    .info-section {
      margin-bottom: 20px;
    }
    
    .info-section h3 {
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    
    .dark-mode .info-section h3 {
      border-bottom: 1px solid #444;
    }
    
    /* Hacer que las tarjetas de países tengan un cursor de puntero para indicar que son clickeables */
    .country-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .country-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    
    /* Animaciones */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleElement);
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", init);
