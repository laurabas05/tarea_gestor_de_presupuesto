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
const pTotalGastos = document.getElementById("total");

function crearFormularioGasto() {
    const form = document.createElement("form");

    const divDescripcion = document.createElement("div");
    divDescripcion.className = "form-control";
    const labelDescripcion = document.createElement("label");
    labelDescripcion.textContent = "Descripción:";
    const inputDescripcion = document.createElement("input");
    inputDescripcion.type = "text";
    inputDescripcion.id = "descripcion";
    inputDescripcion.required = true;
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

        actualizarListado();

        // se limpia el formulario después de enviarlo
        form.reset();
    });
}

class MiGasto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // se clona el contenido de la template 'plantilla-gasto' en el html
        const plantilla = document.getElementById("plantilla-gasto");
        const contenido = plantilla.content.cloneNode(true);

        // ya que el css q tenemos no afecta al componente, 
        // copio los estilos q se necesiten para añadirlos al shadow
        const estilo = document.createElement("style");
        estilo.textContent = `
            .gasto {
                margin: 1em 0;
                box-shadow: 5px 5px 5px #555555;
                border: 1px solid #555555;
                padding: 0.5em;
            }
            .gasto-etiquetas-etiqueta {
                display: inline-block;
                background-color: #ccc;
                border-radius: 5px;
                padding: 2px 5px;
                margin-right: 5px;
                font-size: 0.9em;
            }
            button {
                margin-top: 5px;
                margin-right: 5px;
                background-color: #333;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
            }
            button:hover {
                background-color: #555;
            }
        `;


        // se añade al shadow root del componente
        this.shadowRoot.appendChild(estilo, contenido);
    }

    // cuando se defina un gasto se guarda en el setter datos
    set datos(gasto) {
        this._gasto = gasto;
        this.render();
    }

    render() {
        // se busca dentro del SDom los elementos para ponerles como texto su propiedad correspondiente
        this.shadowRoot.querySelector(".gasto-descripcion").textContent = this._gasto.descripcion;
        this.shadowRoot.querySelector(".gasto-valor").textContent = this._gasto.valor;
        this.shadowRoot.querySelector(".gasto-fecha").textContent = this._gasto.fecha;
        // se limpian las etiquetas (pa que no se repitan) 
        const etiquetasDiv = this.shadowRoot.querySelector(".gasto-etiquetas");
        etiquetasDiv.innerHTML = "";
        // por tema de css, creo un span para cada una con su clase correspondiente
        this._gasto.etiquetas.forEach((etiqueta) => {
            const span = document.createElement("span");
            span.classList.add("gasto-etiquetas-etiqueta");
            span.textContent = etiqueta;
            etiquetasDiv.appendChild(span);
        });

        // obtenemos los botones d la template
        const botonBorrar = this.shadowRoot.querySelector("#borrar");
        const botonEditar = this.shadowRoot.querySelector("#editar");
        const formEdicion = this.shadowRoot.querySelector("#form-edicion");

        // botonBorrar: se llama a 'borrarGasto' pasando el id del gasto y se actualiza la vista
        botonBorrar.onclick = () => {
            borrarGasto(this._gasto.id);
            actualizarListado();
        };

        // botonEditar: muestra el formulario d edicion
        botonEditar.onclick = () => {
            formEdicion.style.display = "block";
            const desc = this.shadowRoot.querySelector("#nuevaDescripcion");
            const val = this.shadowRoot.querySelector("#nuevoValor");
            const fec = this.shadowRoot.querySelector("#nuevaFecha");
            // rellena los campos con los valores actuales
            desc.value = this._gasto.descripcion;
            val.value = this._gasto.valor;
            fec.value = this._gasto.fecha;
        };

        // evita la recarga cuando se envie el formulario de edicion
        formEdicion.onsubmit = (event) => {
            event.preventDefault();
            // lee los nuevos valores q hemos editado
            const desc = this.shadowRoot.querySelector("#nuevaDescripcion").value;
            const val = parseFloat(
                this.shadowRoot.querySelector("#nuevoValor").value
            );
            const fec = this.shadowRoot.querySelector("#nuevaFecha").value;
            // se almacenan los nuevos valores
            this._gasto.descripcion = desc;
            this._gasto.valor = val;
            this._gasto.fecha = fec;
            // se oculta el form de edicion y se actualiza la vista
            formEdicion.style.display = "none";
            actualizarListado();
        };

        // el boton cancelar simplemente oculta el form de edicion
        this.shadowRoot.querySelector("#cancelar").onclick = () => {
            formEdicion.style.display = "none";
        };
    }
}

customElements.define("mi-gasto", MiGasto);

function actualizarListado() {
    contenedorListado.innerHTML = "";
    const gastos = listarGastos();

    gastos.forEach((gasto) => {
        const elemento = document.createElement("mi-gasto");
        elemento.datos = gasto;
        contenedorListado.appendChild(elemento);
    });

    const total = calcularTotalGastos();
    pTotalGastos.textContent = total + " €";
}

crearFormularioGasto();
actualizarListado();