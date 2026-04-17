// ============================================================
// CONVERSOR DE MONEDA - Usando open.er-api.com (sin API key)
// Base: UYU (Peso Uruguayo)
// ============================================================

const BASE_URL = "https://open.er-api.com/v6/latest/UYU";

// Monedas que se mostrarán en el select del conversor
const MONEDAS_PERMITIDAS = ["UYU", "USD", "EUR", "ARS", "BRL", "GBP", "JPY"];

let tasas = {};

// Trae las tasas de cambio y puebla el select con las monedas permitidas
async function cargarTasas() {
    try {
        const res = await fetch(BASE_URL);
        const data = await res.json();

        tasas = data.rates;

        const selectMoneda = document.getElementById("converter");

        // Solo agrega las monedas que están en MONEDAS_PERMITIDAS
        MONEDAS_PERMITIDAS.forEach((moneda) => {
            if (!tasas[moneda]) return;
            const option = document.createElement("option");
            option.value = moneda;
            option.textContent = moneda;
            selectMoneda.appendChild(option);
        });

        // Valor predeterminado del select: UYU
        selectMoneda.value = "UYU";
        convertir();
    } catch (error) {
        console.error("Error en el fetch:", error);
    }
}

// Convierte el balance actual a la moneda seleccionada y lo muestra
function convertir() {
    const selectMoneda = document.getElementById("converter");
    const balanceTotal = document.getElementById("balance__movimientos");
    const mostrarConvertido = document.getElementById("moneda--convertida");

    const monedaSeleccionada = selectMoneda.value;

    // Si la moneda es UYU no hay nada que convertir
    if (monedaSeleccionada === "UYU") {
        mostrarConvertido.textContent = "";
        return;
    }

    // Limpia el texto para obtener solo el número
    const balance = parseFloat(balanceTotal.textContent.replace(/[^0-9.-]/g, "")) || 0;

    if (!tasas[monedaSeleccionada]) return;

    const resultado = balance * tasas[monedaSeleccionada];
    mostrarConvertido.textContent = `${resultado.toFixed(2)} ${monedaSeleccionada}`;
}

// Cada vez que cambia el select, se reconvierte
document.getElementById("converter").addEventListener("change", convertir);

// Iniciamos la carga de tasas al cargar la página
cargarTasas();