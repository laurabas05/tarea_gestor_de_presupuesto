import {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos
} from 'gestionPresupuesto.js';

function crearFormularioGasto() {
    const contenedor = document.getElementById("formularioGastos");

    const form = document.createElement("form");

    const inputDescripcion = document.createElement("input");
    inputDescripcion.type = "text";
    inputDescripcion.id = "descripcion";
    inputDescripcion.placeholder = "Descripción del gasto";
    inputDescripcion.required = "true";

    const inputValor = document.createElement("input");
    inputValor.type = "number";
    inputValor.id = "valor";
    inputValor.placeholder = "Importe del gasto (€)";
    inputValor.required = true;

    const inputFecha = document.createElement("input");
    inputFecha.type = "date";
    inputFecha.id = "fecha";
    inputFecha.placeholder = "Fecha del gasto";

    const inputEtiquetas = document.createElement("input");
    inputEtiquetas.type = "text";
    inputEtiquetas.id = "etiquetas";
    inputEtiquetas.placeholder = "Etiquetas del gasto";

    const botonAniadirGasto = document.createElement("button");
    botonAniadirGasto.type = "submit";
    botonAniadirGasto.textContent = "Añadir gasto";

    form.append(
        inputDescripcion,
        inputValor,
        inputFecha,
        inputEtiquetas,
        botonAniadirGasto
    );

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const descripcion = inputDescripcion.value;
        // ya q valor devuelve una cadena, lo convertimos a un float
        const valor = parseFloat(inputValor.value);
        const fecha = inputFecha.value;
        // dividimos la cadena de etiquetas en un array usando la coma como separador
        const etiquetas = inputEtiquetas.value
            .split(",");
        
        anyadirGasto(descripcion, valor, fecha, ...etiquetas);

        // se refresca la interfaz
        mostrarListadoGastos();
        mostrarTotalGastos();

        // se limpia el formulario
        form.reset();
    });

    // se incorpora el formulario al html
    contenedor.appendChild(form);
}

function mostrarListadoGastos() {

}

function mostrarTotalGastos() {

}