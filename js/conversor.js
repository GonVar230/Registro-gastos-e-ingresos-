// Converser de moneda segun el balance total
const selectorMoneda = document.getElementById("selector__moneda");
const balanceConvertido = document.getElementById("balance__convertido");

const convertirMoneda = async () => {

    // / Obtenemos la moneda elegida en el selector de HTML
    const monedaDestino = selectorMoneda.value;

    const balanceTexto = document.getElementById("balance__movimientos").textContent;

    const balance = Number(balanceTexto.replace("$",""));

    // Si el balance es 0  no se realiza ninguna conversion
    if (!balance) {
        balanceConvertido.textContent = "";
        return;
    }

    try {

        // Peticion para la API y UYU como moneda base 
        const res = await fetch("https://open.er-api.com/v6/latest/UYU");

        // Convertir respuesta de la API a JSON
        const data = await res.json();

        // Tasa de cambio segun moneda destino
        const tasa = data.rates[monedaDestino];

        // calcula segun el balance de mi HTML, lo multplica segun la conversion con la moneda destino y limita a 2 decimales
        const resultado = (balance * tasa).toFixed(2);

        balanceConvertido.textContent = `≈ ${monedaDestino} ${resultado}`;

    } catch (error) {

        // Si hay un error se muestra en consola
        console.error("Error al convertir moneda", error);

    }
};

selectorMoneda.addEventListener("change", convertirMoneda);

