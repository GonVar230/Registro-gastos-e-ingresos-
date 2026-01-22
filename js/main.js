
let ingresosMensuales = parseInt(prompt("Ingrese sus ingresos esperados mensuales, sin especificar tipo de moneda"));

let listaGastos = [];

function gastos() {
    let gasto = prompt("nombre referencial para su gasto");
    let precioGasto = parseInt(prompt("Ingrese cuanto fue el gasto"));

    listaGastos.push(`Nombre: ${gasto} Precio: ${precioGasto} / `);
    ingresosMensuales -= precioGasto;
}

const revisarGastos = () => {
    if (listaGastos.length === 0) {
        alert("No hay gastos registrados");
        return;
    }
    alert(listaGastos);
}

const saldo = () => {
    alert("Salddo actual: " + ingresosMensuales);
}

let caso;

while (caso !== 4) {
    
    caso = parseInt(prompt("1- Agregar Gasto 2- Revisar Gastos 3- Ver Saldo 4- Salir"));

    switch(caso) {
        case 1:
            gastos();
            break;
        case 2:
            revisarGastos();
            break;
        case 3:
            saldo();
            break;
        case 4:
            alert("Saliendo...")
            break;
        default:
            alert("Opción inválida");
    }
}





