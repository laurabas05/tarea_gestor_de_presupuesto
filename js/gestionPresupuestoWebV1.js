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
} from './gestionPresupuesto.js';

crearFormularioGasto();
actualizarInterfaz();

function crearFormularioGasto() {
    const contenedor = document.getElementById("formularioGastos");
    contenedor.innerHTML = "";

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
        
        const nuevoGasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);
        anyadirGasto(nuevoGasto);

        actualizarInterfaz();

        // se limpia el formulario
        form.reset();
    });

    // se incorpora el formulario al html
    contenedor.appendChild(form);
}

function mostrarListadoGastos() {
    const contenedor = document.getElementById("listadoGastos");
    // con esto limpio el listado anterior porq si no salen los gastos duplicados 
    contenedor.innerHTML = "";

    const listaGastos = listarGastos();

    if (listaGastos.length === 0) {
        contenedor.textContent = "No hay gastos registrados.";
        return;
    }

    listaGastos.forEach(gasto => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${gasto.descripcion}</strong> - ${gasto.valor} €</p>
            <p><strong>Fecha: </strong>${new Date(gasto.fecha).toLocaleDateString()}</p>
            <p><strong>Etiquetas: </strong>${gasto.etiquetas.join(", ") || "No contiene etiquetas"}</p>
        `;

        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar";
        botonBorrar.addEventListener("click", () => {
            borrarGasto(gasto.id);
            actualizarInterfaz();
        });

        div.appendChild(botonBorrar);
        contenedor.appendChild(div);
    });
}

function mostrarTotalGastos() {
    const contenedor = document.getElementById("totalGastos");

    const totalGastos = calcularTotalGastos();
    contenedor.textContent = `${totalGastos} €`;
}

function actualizarInterfaz() {
    mostrarListadoGastos();
    mostrarTotalGastos();
}