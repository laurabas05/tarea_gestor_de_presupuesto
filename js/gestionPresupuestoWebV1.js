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


const contenedorFormulario = document.getElementById("formularioGastos");
const contenedorListado = document.getElementById("listadoGastos");
const pTotalGastos = document.getElementById("totalGastos");

function crearFormularioGasto() {
    const form = document.createElement("form");

    const divDescripcion = document.createElement("div");
    divDescripcion.className = "form-control";
    const labelDescripcion = document.createElement("label");
    labelDescripcion.textContent = "Descripción:";
    const inputDescripcion = document.createElement("input");
    inputDescripcion.type = "text";
    inputDescripcion.id = "descripcion";
    inputDescripcion.required = "true";
    divDescripcion.append(labelDescripcion, inputDescripcion)

    const divValor = document.createElement("div");
    divValor.className = "form-control";
    const labelValor = document.createElement("label");
    labelValor.textContent = "Valor (€):"
    const inputValor = document.createElement("input");
    inputValor.type = "number";
    inputValor.id = "valor";
    inputValor.required = true;
    divValor.append(labelValor, inputValor);

    const divFecha = document.createElement("div");
    divFecha.className = "form-control";
    const labelFecha = document.createElement("label");
    labelFecha.textContent = "Fecha:";
    const inputFecha = document.createElement("input");
    inputFecha.type = "date";
    inputFecha.id = "fecha";
    divFecha.append(labelFecha, inputFecha);

    const divEtiquetas = document.createElement("div");
    divEtiquetas.className = "form-control";
    const labelEtiquetas = document.createElement("label");
    labelEtiquetas.textContent = "Etiquetas (separadas por coma):";
    const inputEtiquetas = document.createElement("input");
    inputEtiquetas.type = "text";
    inputEtiquetas.id = "etiquetas";
    inputEtiquetas.placeholder = "Etiquetas del gasto";
    divEtiquetas.append(labelEtiquetas, inputEtiquetas);

    const botonAniadirGasto = document.createElement("button");
    botonAniadirGasto.type = "submit";
    botonAniadirGasto.textContent = "Añadir gasto";

    form.append(
        divDescripcion,
        divValor,
        divFecha,
        divEtiquetas,
        botonAniadirGasto
    );

    // se incorpora el formulario al html
    contenedorFormulario.appendChild(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const descripcion = inputDescripcion.value;
        // ya q valor devuelve una cadena, lo convertimos a un float
        const valor = parseFloat(inputValor.value);
        const fecha = inputFecha.value;
        // dividimos la cadena de etiquetas en un array usando la coma como separador
        const etiquetas = inputEtiquetas.value.split(",");
        
        const nuevoGasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);
        anyadirGasto(nuevoGasto);

        actualizarInterfaz();
        // se limpia el formulario
        form.reset();
    });
}

function mostrarListadoGastos() {
    const listaGastos = listarGastos();
    // 
    contenedorListado.querySelectorAll(".gasto").forEach(g => g.remove());

    if (listaGastos.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No hay gastos registrados.";
        contenedorListado.appendChild(p);
        return;
    }

    listaGastos.forEach(gasto => {
        const div = document.createElement("div");
        div.className = "gasto";

        div.innerHTML = `
            <div class="gasto-descripcion">${gasto.descripcion}</div>
            <div class="gasto-fecha">${new Date(gasto.fecha).toLocaleDateString()}</div>
            <div class="gasto-valor">${gasto.valor}</div>
            <div class="gasto-etiquetas">${gasto.etiquetas.join(", ") || "No contiene etiquetas"}</div>
        `;

        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar";
        botonBorrar.addEventListener("click", () => {
            if (confirm("¿Seguro que quieres borrar este gasto?")) {
                borrarGasto(gasto.id);
                actualizarInterfaz();
            }
        });

        div.appendChild(botonBorrar);
        contenedorListado.appendChild(div);
    });
}

function mostrarTotalGastos() {
    const totalGastos = calcularTotalGastos();
    pTotalGastos.textContent = `${totalGastos} €`;
}

function actualizarInterfaz() {
    mostrarListadoGastos();
    mostrarTotalGastos();
}

crearFormularioGasto();
actualizarInterfaz();