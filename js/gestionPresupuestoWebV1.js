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

// declaro los contenedores q vamos a modificar
const contenedorFormulario = document.getElementById("formularioGastos");
const contenedorListado = document.getElementById("listadoGastos");
const pTotalGastos = document.getElementById("total");

function crearFormularioGasto() {
    const form = document.createElement("form");

    // ahora, para cada parametro, le declaro su contenedor,
    // y dentro su label y su input. Esto lo hago por adaptarme
    // al css que ya venía en el proyecto.
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
    inputValor.step = "0.01" // para q acepte decimales
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

    // añadimos los contenedores que hemos creado al formulario
    form.append(
        divDescripcion,
        divValor,
        divFecha,
        divEtiquetas,
        botonAniadirGasto
    );

    // se incorpora el formulario al html
    contenedorFormulario.appendChild(form);

    // funcion para evitar q se recargue la pagina al enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const descripcion = inputDescripcion.value;
        // ya q valor devuelve una cadena, lo convertimos a un float
        const valor = parseFloat(inputValor.value);
        const fecha = inputFecha.value;
        // dividimos la cadena de etiquetas en un array usando por ejemplo la coma como separador
        const etiquetas = inputEtiquetas.value.split(",");
        
        // no queremos q se recargue la pagina porq queremos mostrar
        // dinámicamente los objetos gasto que vayamos creando
        const nuevoGasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);
        anyadirGasto(nuevoGasto);

        actualizarInterfaz();

        // se limpia el formulario después de enviarlo
        form.reset();
    });
}

function mostrarListadoGastos() {
    const listaGastos = listarGastos();
    // esto lo hago para q cuando se actualicen los gastos se borre el listado anterior
    // (si no los gastos se duplicarían visualmente)
    contenedorListado.innerHTML = "";

    if (listaGastos.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No hay gastos registrados.";
        contenedorListado.appendChild(p);
        return;
    }

    // funcion que simplemente muestra cada gasto q hemos creado
    // y su botón de borrado
    listaGastos.forEach(gasto => {
        const div = document.createElement("div");
        div.className = "gasto";

        div.innerHTML = `
            <div class="gasto-descripcion">${gasto.descripcion}</div>
            <div class="gasto-fecha">${new Date(gasto.fecha).toLocaleDateString()}</div>
            <div class="gasto-valor">${gasto.valor}</div>
            <div class="gasto-etiquetas">${gasto.etiquetas.map(etiqueta => `<span class="gasto-etiquetas-etiqueta">${etiqueta}</span>`)}</div>
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

// funcion para actualizar visualmente lo q vamos añadiendo y borrando
function actualizarInterfaz() {
    mostrarListadoGastos();
    mostrarTotalGastos();
}

crearFormularioGasto();
actualizarInterfaz();