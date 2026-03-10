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


const alertaNombre = document.querySelector(".alerta__name");
const alertaIngreso = document.querySelector(".alerta__ingreso");
const alertaAhorro = document.querySelector(".alerta__ahorro--mes");
const alertaMes = document.querySelector(".alerta__mes");

// Limpia los mensajes de error y elimina el estilo visual de error en los inputs
const limpiarAlertas = () => {
    alertaNombre.textContent = "";
    alertaIngreso.textContent = "";
    alertaAhorro.textContent = "";
    alertaMes.textContent = "";

    inputNombre.classList.remove("input-error");
    inputIngresos.classList.remove("input-error");
    ahorroInput.classList.remove("input-error");
    mesInput.classList.remove("input-error");
};

// Modal con SweetAlert para recordatorio al iniciar el programa 
const mostrarRecordatorio = () => {

    setTimeout(() => {
        Swal.fire({
            title: "Recordatorio",
            text: "Guarda los cambios luego de agregar un movimiento para asegurar el registro.",
            icon: "info",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#16A34A",
            timer: 7000,
            timerProgressBar: true,
            allowOutsideClick: true
        });

        localStorage.setItem("recordatorioMostrado", "true");

    }, 4000);
};

// Escuchamos el submit del formulario
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    limpiarAlertas();

    // Seleccionamos los valores de los inputs
    const nombre = inputNombre.value.trim();
    const ingresos = inputIngresos.value.trim();
    const ahorro = ahorroInput.value.trim();
    const mes = mesInput.value.trim();

    // Se usa para bloquear el envio del formulario si algún campo es invalido
    let hayErrores = false;

    // Validaciones
    if (!nombre) {
        alertaNombre.textContent = "Ingrese un nombre válido";
        inputNombre.classList.add("input-error");
        hayErrores = true;
    }

    if (!mes) {
        alertaMes.textContent = "Ingrese un mes válido";
        mesInput.classList.add("input-error");
        hayErrores = true;
    }

    if (!ingresos || ingresos <= 0) {
        alertaIngreso.textContent = "Los ingresos deben ser mayores a 0";
        inputIngresos.classList.add("input-error");
        hayErrores = true;
    }

    if (!ahorro || ahorro <= 0) {
        alertaAhorro.textContent = "El ahorro debe ser mayor a 0";
        ahorroInput.classList.add("input-error");
        hayErrores = true;
    }

    // Cancela la ejecucion del submit si hayErrores es true
    if (hayErrores) return;

    localStorage.removeItem("recordatorioMostrado");

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

    if (!localStorage.getItem("recordatorioMostrado")) {
    mostrarRecordatorio();
    }
});

// Haciendo un sidebar para el dashboard
const logo = document.querySelector(".cont__imagen--logo");
const spans = document.querySelector(".span__sidebar");
const sidebar = document.querySelector(".sidebar");
const textSideBar = document.getElementById("text__sidebar");

// Cuando se hace hover se expande
sidebar.addEventListener("mouseenter", () => {
    logo.style.opacity = "1";
    logo.style.transform = "translateY(0)";

    layout.classList.add("expandido");

    spans.classList.add("span__visible");

    textSideBar.classList.add("span__visible");
    textSideBar.textContent = "Controlá ingresos, gastos y ahorros en un solo lugar."
});

// Hover out y se contrae 
sidebar.addEventListener("mouseleave", () => {
    logo.style.opacity = "0";
    logo.style.transform = "translateY(-10px)";

    layout.classList.remove("expandido");
    layout.style.transition = "all 0.2s ease-in-out"

    spans.classList.remove("span__visible");

    textSideBar.classList.remove("span__visible");
    textSideBar.textContent = ""
});

// Haciendo modal para intentar reutilizar la funcion

// Primero realizo el modal de ahorros y lo enlazo al historial

const CrearModal = ({titulo,campos,btnId,onConfirm}) => {

    let modal = document.createElement("div");
    let form = document.createElement("form");

    modal.classList.add("modal");
    form.classList.add("modal__form");

    // Esta variable nos permite generar inputs dinamicamente para futuros modales segun el valore que recibe "campos"
    //Le tuve agregar una condicional para detectar si el campo es de tipo "select" y así permita crear opciones
    let inputsHTML = campos.map(campo => {

    // Si el campo es de tipo select se generan las opciones dinámicamente
    if (campo.type === "select") {
        const opciones = campo.options.map(op =>
            `<option value="${op}">${op}</option>`
        ).join("");

        return `
            <label>${campo.label}</label>
            <select id="${campo.id}" required>
                ${opciones}
            </select>
        `;
    }

    // Si no es select, se genera un input normal usando el type recibido
    return `
        <label>${campo.label}</label>
        <input type="${campo.type}" id="${campo.id}" required>
    `;
}).join("");

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
const tablaAhorros = document.getElementById("tabla__ahorros");

// Funcion para crear ahorro y enlazarlo al historial de ahorros
// El segundo parametro creamos una variiable la cual nos permita sumar si es true o false, dado que cuando guardaba los datos en el local storage se sumaban al recargar, entonces al momento de obtener eso guardado no se sume algo que no es un ahorro
const crearAhorro = (valores, sumarAlTotal = true) => {

    const montoAhorrado = Number(valores.valor__ahorro);

    if (sumarAlTotal) {
        totalAhorros += montoAhorrado;
        contadorAhorros.textContent = `$${totalAhorros}`
    }

    const filaAhorro = document.createElement("tr");

    // Aca se crean las filas para la tabla, con el fin de que los valores queden mas centrados
    filaAhorro.innerHTML = `
        <td>
            <i class="bi bi-piggy-bank"></i>
        </td>

        <td>$ ${valores.valor__ahorro}</td>

        <td>${valores.fecha__ahorro}</td>

        <td>
            <button class="del__ahorro">
                <i class="bi bi-x-lg"></i>
            </button>
        </td>
    `;

    // Borrar fila y restar del total
    filaAhorro.querySelector(".del__ahorro").addEventListener("click", () => {
        totalAhorros -= montoAhorrado;
        contadorAhorros.textContent = `$ ${totalAhorros}`;
        filaAhorro.remove();
    });

    // Para poner encima en vez de abajo
    tablaAhorros.prepend(filaAhorro);
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
        onConfirm: (valores) => {
            crearAhorro({
                valor__ahorro: valores.valor__ahorro,
                fecha__ahorro: new Date(valores.fecha__ahorro).toLocaleDateString()
            });
        }
    });
});

// Boton para abrir modal y agregar ingreso
const btnAgregarIngreso = document.getElementById("btn__agregar--ingreso");

btnAgregarIngreso.addEventListener("click", () => {
    CrearModal({
        titulo: "Agregar Ingreso",
        campos: [
            { label: "Monto", type: "number", id: "valor__ingreso" },
            { label: "Fecha", type: "date", id: "fecha__ingreso" }
        ],
        btnId: "confirmar__ingreso",
        onConfirm: (valores) => {
            crearIngreso({
                valor__ahorro: valores.valor__ingreso,
                fecha__ahorro: new Date(valores.fecha__ingreso).toLocaleDateString(),
                tipo: "Ingreso"
            });
        }
    });
});

// Boton para abrir modal y agregar gasto
const btnAgregarGasto = document.getElementById("btn__agregar--gasto");

btnAgregarGasto.addEventListener("click", () => {
    CrearModal({
        titulo: "Agregar Gasto",
        campos: [
            {
                label: "Tipo de Gasto",
                type: "select",
                id: "tipo__gasto",
                options: [
                    "Entretenimiento",
                    "Hogar",
                    "Comida",
                    "Transporte",
                    "Imprevisto",
                    "Salud"
                ]
            },
            { label: "Monto", type: "number", id: "valor__gasto" },
            { label: "Fecha", type: "date", id: "fecha__gasto" }
        ],
        btnId: "confirmar__gasto",

        onConfirm: (valores) => {

            const icono = obtenerIconoGasto(valores.tipo__gasto);

            crearIngreso({
                valor__ahorro: valores.valor__gasto,
                fecha__ahorro: new Date(valores.fecha__gasto).toLocaleDateString(),
                icono: icono,
                tipo: valores.tipo__gasto
            });

        }
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
        balanceTotal: balanceTotal,
        historialAhorros: [],
        historialIngresos: []
    }

    // Se recorre los valores de los inputs que se aplican en los td de la tabla creados anteriormente
    document.querySelectorAll("#tabla__ahorros tr").forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length === 0) return;

        const monto = celdas[1].textContent.replace("$", "").trim();
        const fecha = celdas[2].textContent;

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

    balanceTotal = datosGuardados.balanceTotal || 0;
    balanceMovimientos.textContent = `$ ${balanceTotal}`;

    layout.style.display = "grid";
    document.querySelector(".cont__cuestionario--inicial").style.display = "none";
    

    // Recorre los ahorros guardados y los muestra
    // Se pasa false para que no se sumen nuevamente al total
    datosGuardados.historialAhorros.reverse().forEach(item => {
        crearAhorro({
            valor__ahorro: item.monto,
            fecha__ahorro: item.fecha
        },false);
    });

    ultimosMovimientos.innerHTML = "";
    // Recorre los ingresos guardados y los muestra
    datosGuardados.historialIngresos.reverse().forEach(item => {
        crearIngreso({
            valor__ahorro: item.monto,
            fecha__ahorro: item.fecha,
            icono: item.icono,
            tipo: item.tipo
        });
    });
    actualizarBalance();
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
        localStorage.removeItem("dashboardFinanzas");
        localStorage.removeItem("recordatorioMostrado");
        location.reload();
    });

    // Cancelar borrar
    confirmarBorrar.querySelector("#cancelar__eliminar").addEventListener("click", () => {
        confirmarBorrar.remove();
    });
});

// Para igualar y mostrar totales
let totalIngresos = 0;
let totalGastos = 0;
const montoGastos = document.getElementById("monto__gastos");

// Generamos un balance total
let balanceTotal = 0;
const balanceMovimientos = document.getElementById("balance__movimientos");

const actualizarBalance = () => {
    balanceTotal = totalIngresos - totalGastos;
    balanceMovimientos.textContent = `$ ${balanceTotal}`;
};

// tabla donde se agregan los últimos movimientos 
const ultimosMovimientos = document.getElementById("ultimos__movimientos");

// Funcion reutilizable para crear ingresos
const crearIngreso = (valores) => {

    const monto = Number(valores.valor__ahorro);
    const esIngreso = valores.tipo === "Ingreso";

    // Condicional para ver si es un ingreso
    if (esIngreso) {
        totalIngresos += monto;
        montoIngresos.textContent = `$ ${totalIngresos}`;
    } else {
        totalGastos += monto;
        montoGastos.textContent = `$ ${totalGastos}`;
    }

    actualizarBalance();

    const filaIngreso = document.createElement("tr");

    filaIngreso.innerHTML = `
        <td>
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

    // Para poner encima en vez de abajo
    ultimosMovimientos.prepend(filaIngreso);

    // Boton que se encarga de borrar la fila y influye en total
    filaIngreso.querySelector(".del__historial").addEventListener("click", () => {
        if (esIngreso) {
            totalIngresos -= monto;
            montoIngresos.textContent = `$ ${totalIngresos}`;
        } else {
            totalGastos -= monto;
            montoGastos.textContent = `$ ${totalGastos}`;
        }
        actualizarBalance();
        filaIngreso.remove()
    });
}

// Devuelve el icono segun el tipo de gasto seleccionado
const obtenerIconoGasto = (tipo) => {

    switch (tipo) {
        case "Entretenimiento":
            return `<i class="bi bi-controller"></i>`;

        case "Hogar":
            return `<i class="bi bi-house"></i>`;

        case "Comida":
            return `<i class="bi bi-fork-knife"></i>`;

        case "Transporte":
            return `<i class="bi bi-car-front-fill"></i>`;

        case "Imprevisto":
            return `<i class="bi bi-exclamation-triangle"></i>`;

        case "Salud":
            return `<i class="bi bi-heart-pulse"></i>`;
    }
};


// Ponemos el primer mes como un ahorro en ultimos movimientos 
const primerIngreso = () => {

    const ingresoIndividual = Number(inputIngresos.value.trim());

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