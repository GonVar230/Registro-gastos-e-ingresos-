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
    mesMostrar.innerHTML = `Mes Visualizado: <strong>${mes}</strong>`;

    // Esta funcion nos permite poner el primer valor del form en los ultimos movimientos
    primerIngreso();

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
// El segundo parametro creamos una variiable la cual nos permita sumar si es true o false, dado que cuando guardaba los datos en el local storage se sumaban al recargar, entonces al momento de obtener eso guardado no se sume algo que no es un ahorro
const crearAhorro = (valores, sumarAlTotal = true) => {
    const enlazar = document.createElement("div");
    enlazar.classList.add("enlazar");

    const montoAhorrado = Number(valores.valor__ahorro);

    if (sumarAlTotal) {
        totalAhorros += montoAhorrado;
        contadorAhorros.textContent = `$${totalAhorros}`
    }



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
        historialAhorros: [],
        historialIngresos: []
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

    // Se recorren los valores de las filas en la tabla y se guardan en historialIngresos
    document.querySelectorAll("#ultimos__movimientos tr").forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length === 0) return;
        const icono = celdas[0].innerHTML;
        const monto = celdas[1].textContent.replace("$", "").trim();
        const fecha = celdas[2].textContent;
        const tipo = celdas[3].textContent;

        datos.historialIngresos.push({
            icono: icono,
            monto: Number(monto),
            fecha: fecha,
            tipo: tipo
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

    // Recorre los ahorros guardados y los muestra
    // Se pasa false para que no se sumen nuevamente al total
    datosGuardados.historialAhorros.forEach(item => {
        crearAhorro({
            valor__ahorro: item.monto,
            fecha__ahorro: item.fecha
        },false);
    });

    // Recorre los ingresos guardados y los muestra
    datosGuardados.historialIngresos.forEach(item => {
        crearIngreso({
            valor__ahorro: item.monto,
            fecha__ahorro: item.fecha,
            icono: item.icono,
            tipo: item.tipo
        });
    });
};



// simulacion de borrar progreso que en realidad nos mandaria para el inicio del form para volver a empezar

const borrarProgreso = document.getElementById("borrar__progreso");

borrarProgreso.addEventListener("click", () => {

    // Creamos modal de confirmación
    let confirmarBorrar = document.createElement("div");
    confirmarBorrar.classList.add("modal__borrar");

    confirmarBorrar.innerHTML= `
    <h2>¿Estas seguro que quieres borrar tu progreso?</h2>
    <p>Esta acción eliminará todos tus datos guardados y te llevará nuevamente al formulario inicial.</p>
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
});

// tabla donde se agregan los últimos movimientos 
const ultimosMovimientos = document.getElementById("ultimos__movimientos");

// Funcion reutilizable para crear ingresos
const crearIngreso = (valores) => {

    const filaIngreso = document.createElement("tr");

        filaIngreso.innerHTML = `
        <td class="centrar__icono">
            ${valores.icono || `<i class="bi bi-currency-dollar"></i>`} 
        </td>

        <td>
            $ ${valores.valor__ahorro}
        </td>

        <td>${valores.fecha__ahorro}</td>

        <td>${valores.tipo}</td>

        <td>
            <button class="del__historial">
                <i class="bi bi-x-lg"></i>
            </button>
        </td>
    `;

        ultimosMovimientos.appendChild(filaIngreso);

        // Boton que se encarga de borrar la fila
        filaIngreso.querySelector(".del__historial").addEventListener("click", () => {
        filaIngreso.remove()
    });
}


// Ponemos el primer mes como un ahorro en ultimos movimientos 
const primerIngreso = () => {

    const ingresoIndividual = inputIngresos.value.trim();

    if(!ingresoIndividual) return;

    const valores = {
        valor__ahorro: ingresoIndividual,
        fecha__ahorro: new Date().toLocaleDateString(),
        tipo: "Ingreso"
    };

    crearIngreso(valores);
}

// Debe de ir al final para no generar conflicto 
cargarSesion();