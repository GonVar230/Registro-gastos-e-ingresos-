// Igualando los valores del formulario inicial a valores en el dashboard
const formulario = document.querySelector("#iniciando");
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

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const ingresos = inputIngresos.value.trim();
    const ahorro = ahorroInput.value.trim();
    const mes = mesInput.value.trim();

    if(nombre === "" || ingresos === "" || ahorro === "" || mes === "") {
        alert("Completa todos los campos");
        return;
    }

    tituloNombre.textContent = nombre;

    montoIngresos.textContent = "$ " + ingresos;

    ahorroMostrar.textContent = " / $ " + ahorro;

    mesMostrar.textContent = "Mes Visualizado: " + mes;

    document.querySelector(".cont__cuestionario--inicial").style.display = "none";

    layout.style.display = "grid";
});


// Este codigo va a ser borrado proximamante, unicamente lo hago para trabajar en el dashboard
// const cont = document.querySelector(".cont__cuestionario--inicial")

// cont.style.display = "none"

// const lay = document.querySelector(".layout") 

// lay.style.display = "grid"


// Haciendo un sidebar para el dashboard
const logo = document.querySelector(".cont__imagen--logo");
const spans = document.querySelectorAll("nav span");
const sidebar = document.querySelector(".sidebar");


sidebar.addEventListener("mouseenter", () => {
    logo.style.opacity = "1";
    logo.style.transform = "translateY(0)";

    layout.classList.add("expandido");

    spans.forEach( (span) => {
        span.classList.add("span__visible");
    });
});

sidebar.addEventListener("mouseleave", () => {
    logo.style.opacity = "0";
    logo.style.transform = "translateY(-10px)";

    layout.classList.remove("expandido");
    layout.style.transition = "all 0.2s ease-in-out"

    spans.forEach( (span) => {
        span.classList.remove("span__visible");
    });
});


