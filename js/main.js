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

// Escuchamos el submit del formulario
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    // Seleccionamos los valores de los inputs
    const nombre = inputNombre.value.trim();
    const ingresos = inputIngresos.value.trim();
    const ahorro = ahorroInput.value.trim();
    const mes = mesInput.value.trim();

    // Mostramos los valores en el dashboard
    tituloNombre.textContent = nombre;
    montoIngresos.textContent = "$ " + ingresos;
    ahorroMostrar.textContent = " / $ " + ahorro;
    mesMostrar.textContent = "Mes Visualizado: " + mes;

    // Se oculta el formulario y se muestra el dashboard 
    document.querySelector(".cont__cuestionario--inicial").style.display = "none";
    layout.style.display = "grid";
});

// Haciendo un sidebar para el dashboard
const logo = document.querySelector(".cont__imagen--logo");
const spans = document.querySelectorAll(".span__sidebar");
const sidebar = document.querySelector(".sidebar");

// Cuando se hace hover se expande
sidebar.addEventListener("mouseenter", () => {
    logo.style.opacity = "1";
    logo.style.transform = "translateY(0)";

    layout.classList.add("expandido");

    spans.forEach( span => {
        span.classList.add("span__visible");
    });
});

// Hover out y se contrae 
sidebar.addEventListener("mouseleave", () => {
    logo.style.opacity = "0";
    logo.style.transform = "translateY(-10px)";

    layout.classList.remove("expandido");
    layout.style.transition = "all 0.2s ease-in-out"

    spans.forEach( span => {
        span.classList.remove("span__visible");
    });
});

// Haciendo modal para intentar reutilizar la funcion

// Primero realizo el modal de ahorros y lo enlazo al historial

const CrearModal = ({titulo,campos,btnId,onConfirm}) => {

    let modal = document.createElement("div");
    let form = document.createElement("form");

    modal.classList.add("modal");
    form.classList.add("modal__form");

    // Esta variable nos permite generar inputs dinamicamente para futuros modales segun el valore que recibe "campos"
    let inputsHTML = campos.map(campo => `
        <label>${campo.label}</label>
        <input type="${campo.type}" id="${campo.id}" required>
    `).join("");

    // Este es el modelo de los modales para completar reutilizable
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

    // Boton que cierra el modal
    modal.querySelector(".cerrar__modales")
    .addEventListener("click", () => modal.remove());
    
    // Cuando se envia el form del modal 
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Recolectamos valores de inputs
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
const muestraHistorial = document.getElementById("muestra__historial");

// Funcion para crear ahorro y enlazarlo al historial de ahorros
const crearAhorro = (valores) => {
    const enlazar = document.createElement("div");
    enlazar.classList.add("enlazar");

    const montoAhorrado = Number(valores.valor__ahorro);

    // if () {
        totalAhorros += montoAhorrado;
        contadorAhorros.textContent = `$${totalAhorros}`
    // }


    // Esta son los divs que se van a generar en historial movimientos 
    enlazar.innerHTML = `
        <div>
            <div>
                <i class="bi bi-piggy-bank"></i>
                <span>$ ${valores.valor__ahorro}</span>
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

    // Eliminamos el div creado y sacamos el valor del total
    enlazar.querySelector(".del__ahorro").addEventListener("click", () => {
        totalAhorros -= montoAhorrado;
        contadorAhorros.textContent = `$ ${totalAhorros}`;
        enlazar.remove()
    });

    muestraHistorial.appendChild(enlazar);
};

// Boton para abrir el modal con los valores seleccionados para este modal
const btnSumarAhorro = document.getElementById("sumar__ahorro");

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


// Simulador de guardado 

const guardarProgreso = document.getElementById("guardar__sesion");

const guardarSesion = () => {

    // Generar un feedback visual 
    const textoOriginal = guardarProgreso.textContent;
    guardarProgreso.textContent = "Guardando...";

    // Almacenamos todo los datos del dashboard hasta el momento
    const datos = {
        nombre: tituloNombre.textContent,
        ingresos: montoIngresos.textContent,
        ahorroPlan: ahorroMostrar.textContent,
        mes: mesMostrar.textContent,
        totalAhorros: totalAhorros,
        historialAhorros: []
    }

    // Se recorre los valores de los inputs que se aplican en los span 
        document.querySelectorAll(".enlazar").forEach(item => {
        const monto = item.querySelector("span").textContent.replace("$", "");
        const fecha = item.querySelectorAll("span")[1].textContent;

        datos.historialAhorros.push({
            monto: Number(monto),
            fecha: fecha
        });
    });

    // Guardamos todo en localStorage
    localStorage.setItem("dashboardFinanzas", JSON.stringify(datos));

    // Feedback de guardado
    setTimeout(() => {
        guardarProgreso.textContent = "Guardado ✔";
        setTimeout(() => {
            guardarProgreso.textContent = textoOriginal;
        }, 1500);
    }, 1000);

}

guardarProgreso.addEventListener("click", guardarSesion);

const cargarSesion = () => {
    const datosGuardados = JSON.parse(localStorage.getItem("dashboardFinanzas"));

    // Si no hay datos guardados, salimos
    if (!datosGuardados) return; 

    // Usamos los datos guardados para ponerlos en el dashboard 
    tituloNombre.textContent = datosGuardados.nombre;
    montoIngresos.textContent = datosGuardados.ingresos;
    ahorroMostrar.textContent = datosGuardados.ahorroPlan;
    mesMostrar.textContent = datosGuardados.mes;

    totalAhorros = datosGuardados.totalAhorros;
    contadorAhorros.textContent = `$ ${totalAhorros}`;

    layout.style.display = "grid";
    document.querySelector(".cont__cuestionario--inicial").style.display = "none";

    datosGuardados.historialAhorros.forEach(item => {
        crearAhorro({
            valor__ahorro: item.monto,
            fecha__ahorro: item.fecha
        });
    });
};

cargarSesion();

// simulacion de borrar progreso que en realidad nos mandaria para el inicio del form para volver a empezar

const borrarProgreso = document.getElementById("borrar__progreso");

borrarProgreso.addEventListener("click", () => {

    // Creamos modal de confirmación
    let confirmarBorrar = document.createElement("div");
    confirmarBorrar.classList.add("modal__borrar");

    confirmarBorrar.innerHTML= `
    <h2>¿Estas seguro que quieres borrar el progreso?</h2>
    <p>Si desea borrar el progreso, esa opción lo llevara al formulario de inicio</p>
    <div>
        <button id="confirmar__eliminar">Confirmar</button>
        <button id="cancelar__eliminar">Cancelar</button>
    </div>
    `

    document.body.appendChild(confirmarBorrar);

    // Confirmar borrar
    confirmarBorrar.querySelector("#confirmar__eliminar").addEventListener("click", () => {
        localStorage.removeItem("dashboardFinanzas")
        location.reload();
    });

    // Cancelar borrar
    confirmarBorrar.querySelector("#cancelar__eliminar").addEventListener("click", () => {
        confirmarBorrar.remove();
    });
})