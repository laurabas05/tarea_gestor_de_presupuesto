let presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(nuevoPresupuesto) {
    if (typeof nuevoPresupuesto === "number" && nuevoPresupuesto >= 0) {
        presupuesto = nuevoPresupuesto;
        return presupuesto;
    } else {
        console.error(`Error: presupuesto negativo.`);
        return -1;
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    if (typeof valor !== "number" || valor < 0) {
        valor = 0;
    }

    this.descripcion = descripcion;
    this.valor = valor;
    
    if (!fecha) {
        this.fecha = Date.now();
    } else {
        let fechaParse = Date.parse(fecha);
        this.fecha = isNaN(fechaParse) ? Date.now() : fechaParse;
        //si no se introduce una fecha válida, se establece la fecha actual
    }

    this.etiquetas = etiquetas.length > 0 ? etiquetas : [];
    //si no se introducen etiquetas, se establece un array vacío

    this.mostrarGasto = function() {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    };

    this.actualizarDescripcion = function(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    };

    this.actualizarValor = function(nuevoValor) {
        if (typeof nuevoValor === "number" && nuevoValor >= 0) {
            this.valor = nuevoValor;
        }
    };

    this.mostrarGastoCompleto = function() {
        let textoSalida = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.`;
        textoSalida += `\nFecha: ${new Date(this.fecha).toLocaleString()}`;
        textoSalida += `\nEtiquetas:\n`;
        this.etiquetas.forEach(etiqueta => textoSalida += `- ${etiqueta}\n`);
        return textoSalida;
    };

    this.actualizarFecha = function(nuevaFecha) {
        let fechaParse = Date.parse(nuevaFecha);
        if (!isNaN(fechaParse)) this.fecha = fechaParse;
    };

    this.anyadirEtiquetas = function(...nuevasEtiquetas) {
        nuevasEtiquetas.forEach(etiqueta => {
            if (!this.etiquetas.includes(etiqueta)) this.etiquetas.push(etiqueta);
        });
    };

    this.borrarEtiquetas = function(...etiquetas) {
        this.etiquetas = this.etiquetas.filter(etiqueta => !etiquetas.includes(etiqueta));
    };

    this.obtenerPeriodoAgrupacion = function(periodo) {
        const fecha = new Date(this.fecha);

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();

        //los convertimos a cadenas de texto
        //padStart para que tengan dos digitos (formato esperado)
        const mesString = String(mes).padStart(2, "0");
        const diaString = String(dia).padStart(2, "0");

        switch(periodo) {
            case "dia": return `${anio}-${mesString}-${diaString}`;
            case "mes": return `${anio}-${mesString}`;
            case "anyo": return `${anio}`;
        }
    };
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;
    gastos.push(gasto);
    idGasto++;
}

function borrarGasto(id) {
    gastos = gastos.filter(gasto => gasto.id !== id);
}

function calcularTotalGastos() {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

function calcularBalance() {
    return presupuesto - calcularTotalGastos();
}

function filtrarGastos(filtro) {

}

function agruparGastos(periodo, etiquetas, fechaDesde, fechaHasta) {

}

export {
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
}