function darkMode() {
  var element = document.body;
  var modeText = document.getElementById("modeText"); // Asume que tienes un elemento para el texto
  var modeIcon = document.getElementById("modeIcon"); // Asume que tienes un elemento para el icono

  element.classList.toggle("dark-mode");

  // Cambiar el texto
  if (element.classList.contains("dark-mode")) {
    modeText.textContent = "Light Mode";
    modeIcon.innerHTML = "☀️"; // Icono de sol para modo claro
  } else {
    modeText.textContent = "Dark Mode";
    modeIcon.innerHTML = "🌙"; // Icono de luna para modo oscuro
  }
}

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    allCountries = data; // Guardar todos los países para la búsqueda
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
// Esta función se encarga de mostrar los datos en el contenedor
// de datos. Se asume que tienes un contenedor con id "dataContainer" en tu HTML.
// Puedes personalizar el contenido según tus necesidades.
// Puedes descomentar el siguiente bloque de código para usarlo en tu aplicación.
// Asegúrate de que el contenedor exista en tu HTML antes de usarlo.


function displayData(data) {
  const container = document.getElementById("dataContainer");

  data.forEach((country) => {
    const countryDiv = document.createElement("div");
    countryDiv.className = "country";

    countryDiv.innerHTML = `
      <img src="${country.flags.png}" alt="Bandera de ${
      country.name
    }" width="100">
      <h2>${country.name}</h2>
      <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Región:</strong> ${country.region}</p>
      <p><strong>Capital:</strong> ${country.capital || "N/A"}</p>`;
    container.appendChild(countryDiv);
  });

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "data-item";
    div.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
    container.appendChild(div);
  });
}

async function init() {
  const countries = await fetchData();
  if (countries) {
    displayData(countries);
  }
}
init();

let allCountries = []; // Variable para almacenar todos los países

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    allCountries = data; // Guardar todos los países para la búsqueda
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Devolver array vacío en caso de error
  }
}

function handleSearch() {
  const searchBar = document.getElementById("searchBar");
  if (!searchBar) {
    console.error("Elemento searchBar no encontrado");
    return;
  }

  const searchTerm = searchBar.value.toLowerCase();

  // Verificar que allCountries sea un array
  if (!Array.isArray(allCountries)) {
    console.error("No hay datos de países disponibles");
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
  if (typeof displayData === "function") {
    displayData(filteredCountries);
  } else {
    console.error("Función displayData no definida");
  }
}

async function init() {
  const countries = await fetchData();
  if (countries && countries.length > 0) {
    if (typeof displayData === "function") {
      displayData(countries);
    } else {
      console.error("Función displayData no definida");
    }
  } else {
    console.error("No se pudieron cargar los datos de países");
  }
}

// No iniciar automáticamente si estamos en un entorno de prueba
if (typeof process === "undefined" || process.env.NODE_ENV !== "test") {
  init();
}