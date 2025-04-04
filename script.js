function darkMode() {
  var element = document.body;
  var modeText = document.getElementById('modeText'); // Asume que tienes un elemento para el texto
  var modeIcon = document.getElementById('modeIcon'); // Asume que tienes un elemento para el icono
  
  element.classList.toggle("dark-mode");
  
  // Cambiar el texto
  if (element.classList.contains("dark-mode")) {
    modeText.textContent = "Light Mode";
    modeIcon.innerHTML = '☀️'; // Icono de sol para modo claro
  } else {
    modeText.textContent = "Dark Mode";
    modeIcon.innerHTML = '🌙'; // Icono de luna para modo oscuro
  }
}
