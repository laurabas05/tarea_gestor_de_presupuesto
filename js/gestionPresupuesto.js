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
        const fechaParse = Date.parse(fecha);
        this.fecha = isNaN(fechaParse) ? Date.now() : fechaParse;
        //si no se introduce una fecha válida, se establece la fecha actual
    }
    //al final, fecha se almacena en formato timestamp

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
        //se convierte en un objeto Date y luego en formato localizado
        textoSalida += `\nEtiquetas:\n`;
        this.etiquetas.forEach(etiqueta => textoSalida += `- ${etiqueta}\n`);
        return textoSalida;
    };

    //si nuevaFecha no es válida, no se modifica.
    this.actualizarFecha = function(nuevaFecha) {
        const fechaParse = Date.parse(nuevaFecha);
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
        //se crea un objeto date a partir del timestamp
        const fecha = new Date(this.fecha);

        const anio = fecha.getFullYear();
        //se suma 1 porq el método getMonth devuelve los meses empezando por 0 (del 0 al 11)
        //p.ej. enero sería 0. Pero si le sumo 1 los meses irían del 1 al 12.
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();

        //convertimos día y mes a cadenas de texto
        //padStart para q tengan dos digitos (formato q se pide)
        const mesString = String(mes).padStart(2, "0");
        const diaString = String(dia).padStart(2, "0");

        switch(periodo) {
            case "dia": return `${anio}-${mesString}-${diaString}`;
            case "mes": return `${anio}-${mesString}`;
            case "anyo": return `${anio}`;
            default: undefined;
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
    if (!filtro) {
        return gastos;
    }

    return gastos.filter(gasto => {
        //convierto a Date para comparar instantes temporales
        if (filtro.fechaDesde) {
            const fechaGasto = new Date(gasto.fecha);
            const fechaMinima = new Date(filtro.fechaDesde);
            if (fechaGasto < fechaMinima) return false;
        }

        if (filtro.fechaHasta) {
            const fechaGasto = new Date(gasto.fecha);
            const fechaMaxima = new Date(filtro.fechaHasta);
            if (fechaGasto > fechaMaxima) return false;
        }

        if (filtro.valorMinimo) {
            if (gasto.valor < filtro.valorMinimo) return false;
        }

        if (filtro.valorMaximo) {
            if (gasto.valor > filtro.valorMaximo) return false;
        }

        if (filtro.descripcionContiene) {
            const texto = filtro.descripcionContiene.toLowerCase();
            const descripcion = gasto.descripcion.toLowerCase();
            if (!descripcion.includes(texto)) return false;
            //includes comprueba si la descripcion de gasto contiene la subcadena
        }

        if (filtro.etiquetasTiene) {
            //con map se pasa cada etiqueta a minúscula
            const etiquetasGasto = gasto.etiquetas.map(etiqueta => etiqueta.toLowerCase());
            const etiquetasFiltro = filtro.etiquetasTiene.map(etiqueta => etiqueta.toLowerCase());
            //se utiliza some para comprobar q al menos UNA etiqueta coincide
            const etiquetaCoincide = etiquetasFiltro.some(etiqueta => etiquetasGasto.includes(etiqueta));
            if (!etiquetaCoincide) return false;
        }

        return true;
    });
}

//valor por defecto del periodo mes, y etiquetas un array vacío.
function agruparGastos(periodo = "mes", etiquetas = [], fechaDesde, fechaHasta) {
    const resultado = {};

    const fechaMin = fechaDesde ? new Date(fechaDesde) : null;
    const fechaMax = fechaHasta ? new Date(fechaHasta) : new Date();

    gastos.forEach(gasto => {
        const fechaGasto = new Date(gasto.fecha);

        if (fechaMin && fechaGasto < fechaMin) return;
        if (fechaMax && fechaGasto > fechaMax) return;

        if (etiquetas.length > 0) {
            const etiquetasGasto = gasto.etiquetas.map(etiqueta => etiqueta.toLowerCase());
            const etiquetasFiltro = etiquetas.map(etiqueta => etiqueta.toLowerCase());

            const etiquetaCoincide = etiquetasFiltro.some(etiqueta => etiquetasGasto.includes(etiqueta));
            if (!etiquetaCoincide) return;
        }
        const clavePeriodo = gasto.obtenerPeriodoAgrupacion(periodo);

        if (!resultado[clavePeriodo]) {
            resultado[clavePeriodo] = gasto.valor;
        } else {
            resultado[clavePeriodo] += gasto.valor;
        }
    });
    return resultado;
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