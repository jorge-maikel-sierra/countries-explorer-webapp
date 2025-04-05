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
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", init);
