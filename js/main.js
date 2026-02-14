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


// // Este codigo va a ser borrado proximamante, unicamente lo hago para trabajar en el dashboard
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



// Haciendo modal para intentar reutilizar la funcion

// Primero realizo el modal de ahorros y lo enlazo al historial
const btnSumarAhorro = document.getElementById("sumar__ahorro");
const muestraHistorial = document.getElementById("muestra__historial");


const CrearModal = ({titulo,campos,btnId,onConfirm}) => {

    let modal = document.createElement("div");
    let form = document.createElement("form");

    modal.classList.add("modal");
    form.classList.add("modal__form");

    let inputsHTML = campos.map(campo => `
        <label>${campo.label}</label>
        <input type="${campo.type}" id="${campo.id}" required>
    `).join("");

    form.innerHTML = `
        <h3>${titulo}</h3>
        ${inputsHTML}
        <div class="modal__acciones">
            <button type="submit" id="${btnId}">Confirmar</button>
        </div>

        <button class="cerrar__modales"><i class="bi bi-x-lg"></i></button>
    `;

    modal.appendChild(form);
    document.body.appendChild(modal);

    modal.querySelector(".cerrar__modales")
    .addEventListener("click", () => modal.remove());
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const valores = {};

        campos.forEach(campo => {
            valores[campo.id] = form.querySelector(`#${campo.id}`).value;
        });

        onConfirm(valores); 

        modal.remove();
    });
}

let totalAhorros = 0;
const contadorAhorros = document.getElementById("contador__ahorros");

const crearAhorro = (valores) => {
    const enlazar = document.createElement("div");
    enlazar.classList.add("enlazar");

    const montoAhorrado = Number(valores.valor__ahorro);

    totalAhorros += montoAhorrado;
    contadorAhorros.textContent = `$${totalAhorros}`

    enlazar.innerHTML = `
        <div>
            <div>
                <i class="bi bi-piggy-bank"></i>
                <span>$${valores.valor__ahorro}</span>
            </div>
        
            <div>
                <span>${valores.fecha__ahorro}</span>
            </div>
        
            <button class="del__ahorro">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>

        <hr>
    `;

    enlazar.querySelector(".del__ahorro").addEventListener("click", () => {
        totalAhorros -= montoAhorrado;
        contadorAhorros.textContent = `$${totalAhorros}`;
        enlazar.remove()
    });

    muestraHistorial.appendChild(enlazar);
};


btnSumarAhorro.addEventListener("click", () => {
    CrearModal({
        titulo: "Ingrese Ahorro",
        campos: [
            { label: "Monto", type: "number", id: "valor__ahorro" },
            { label: "Fecha", type: "date", id: "fecha__ahorro" }
        ],
        btnId: "confirmar__ahorro",
        onConfirm: crearAhorro
    });
});

