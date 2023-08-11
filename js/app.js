const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const ObjBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Crea un promisse
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();
  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  try {
    const response = await fetch(url);
    const result = await response.json();
    const criptomonedas = await obtenerCriptomonedas(result.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    console.log(error);
  }
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}
function leerValor(e) {
  ObjBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  // validar formulario
  const { moneda, criptomoneda } = ObjBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  // consultar la api con los resultados
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const alerta = document.createElement("DIV");
    alerta.classList.add("error");

    // mensaje de error
    alerta.textContent = mensaje;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

async function consultarAPI() {
  const { moneda, criptomoneda } = ObjBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  mostrarSpinner();

  try {
    const response = await fetch(url);
    const cotizacion = await response.json();
    mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
  } catch (error) {
    console.log(error)
  }

}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

  const precioAlto = document.createElement("p");
  precioAlto.classList.add("contenedor")
  precioAlto.innerHTML = `Alta del dia: <img class="resultado-imagenes" src="./img/arrow-up.svg" alt="flecha Arriba"><span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.classList.add("contenedor")
  precioBajo.innerHTML = `Baja del día:
  <img class="resultado-imagenes" src="./img/arrow-down.svg" alt="flecha Baja">
   <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.classList.add("contenedor")
  ultimasHoras.innerHTML = `Últimas 24 horas: 
  <img class="resultado-imagenes" src="./img/24-hours.svg" alt="simbolo de tiempo">
  <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.classList.add("contenedor")
  ultimaActualizacion.innerHTML = `Última Actualización: 
  <img class="resultado-imagenes" src="./img/ultima-actualizacion.svg" alt="simbolo de tiempo">
  <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);

  formulario.appendChild(resultado);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();
  const spinner = document.createElement("DIV");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;
  resultado.appendChild(spinner);
}
