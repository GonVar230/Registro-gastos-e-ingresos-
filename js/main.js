// Igualando los valores del formulario inicial a valores en el dashboard
const formulario = document.querySelector(".cuestionario__inicial");
const layout = document.querySelector(".layout");
const botonEnviar = formulario.querySelector("button");

const inputNombre = document.getElementById("name");
const tituloNombre = document.getElementById("nombre__titulo");

const montoIngresos = document.getElementById("monto__ingresos");
const inputIngresos = document.getElementById("ingresos");

const ahorroInput = document.getElementById("ahorros-mes");
const ahorroMostrar = document.getElementById("ahorro__pensado");

const mesInput = document.getElementById("mes");
const mesMostrar = document.querySelector(".mes__dashboard");

botonEnviar.addEventListener("click", () => {
    
    const nombre = inputNombre.value;
    const ingresos = inputIngresos.value;
    const ahorro = ahorroInput.value;
    const mes = mesInput.value;

    if(nombre === "" || ingresos === "" || ahorroInput === "" || mesInput === "") {
        alert("Completa todos los campos");
        return;
    }

    tituloNombre.textContent = nombre;
    montoIngresos.textContent = "$ " + ingresos;

    ahorroMostrar.textContent = " / $ " + ahorro;

    mesMostrar.textContent = "Mes Visualizado: " + mes;

    formulario.style.display = "none";

    layout.style.display = "grid";
});