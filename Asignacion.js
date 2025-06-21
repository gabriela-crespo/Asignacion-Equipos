/**
 * Lógica principal para resolver problemas de asignación a través del Método Húngaro.
 * Admite un parámetro para definir si se trata de un problema de minimización o maximización.
 * @param {boolean} esMaximizacion - 'true' para maximización, 'false' para minimización.
 */

// Estado inicial de la matriz (inicia desde 1 fila 1 columna)
let numFilas = 1;
let numColumnas = 1;

// Se ejecuta cuando el contenido del DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  dibujarTabla(); // Conectar botones de la interfaz con sus funciones correspondientes

  document.getElementById("agregarFila").addEventListener("click", anadirFila);
  document
    .getElementById("agregarColumna")
    .addEventListener("click", anadirColumna);
  document.getElementById("quitarFila").addEventListener("click", eliminarFila);
  document
    .getElementById("quitarColumna")
    .addEventListener("click", eliminarColumna); // Conectar los botones de resolución a la función principal

  document
    .getElementById("calcularMinimo")
    .addEventListener("click", () => resolverMetodoHungaro(false));
  document
    .getElementById("calcularMaximo")
    .addEventListener("click", () => resolverMetodoHungaro(true));
});

// --- FUNCIONES PARA MANIPULAR LA INTERFAZ DE USUARIO (UI) ---

/**
 * Crea o redibuja la tabla de costos en el HTML.
 * La tabla se basa en las variables globales `numFilas` y `numColumnas`.
 * Cada celda contiene un input numérico con un valor aleatorio inicial.
 */
function dibujarTabla() {
  const tablaElemento = document.getElementById("matrizCostos");
  tablaElemento.innerHTML = "";
  for (let i = 0; i < numFilas; i++) {
    const fila = tablaElemento.insertRow();
    for (let j = 0; j < numColumnas; j++) {
      const celda = fila.insertCell();
      const valorAleatorio = Math.floor(Math.random() * 20) + 1;
      celda.innerHTML = `<input type="number" value="${valorAleatorio}" />`;
    }
  }
}

/**
 * Incrementa el número de filas de la matriz, si no se ha alcanzado el límite de 6.
 * Luego, vuelve a dibujar la tabla para reflejar el cambio.
 */
function anadirFila() {
  if (numFilas < 6) {
    numFilas++;
    dibujarTabla();
  } else {
    alert("El máximo de filas es 6.");
  }
}

/**
 * Incrementa el número de columnas de la matriz, si no se ha alcanzado el límite de 6.
 * Luego, vuelve a dibujar la tabla para reflejar el cambio.
 */
function anadirColumna() {
  if (numColumnas < 6) {
    numColumnas++;
    dibujarTabla();
  } else {
    // Corregido el mensaje de alerta
    alert("El máximo de columnas es 6.");
  }
}

/**
 * Reduce el número de filas de la matriz, siempre que haya más de una.
 * Luego, vuelve a dibujar la tabla.
 */
function eliminarFila() {
  if (numFilas > 1) {
    numFilas--;
    dibujarTabla();
  }
}

/**
 * Reduce el número de columnas de la matriz, siempre que haya más de una.
 * Luego, vuelve a dibujar la tabla.
 */
function eliminarColumna() {
  if (numColumnas > 1) {
    numColumnas--;
    dibujarTabla();
  }
}

/**
 * Lee los valores de la tabla HTML y los convierte en una matriz numérica (un array de arrays).
 * @returns {number[][]} La matriz de costos/beneficios ingresada por el usuario.
 */
function obtenerMatrizDeEntrada() {
  const filasTabla = document.querySelectorAll("#matrizCostos tr");
  return Array.from(filasTabla, (fila) =>
    Array.from(fila.cells, (celda) => +celda.firstElementChild.value)
  );
}

/**
 * Muestra los pasos de la resolución en el área de texto designada en el HTML.
 * @param {string[]} pasos - Un array de strings, donde cada string es una línea de texto.
 */
function mostrarPasosEnLog(pasos) {
  document.getElementById("logDePasos").textContent = pasos.join("\n");
}

// --- LÓGICA CENTRAL DEL MÉTODO HÚNGARO (MODIFICADA) ---

/**
 * Orquesta la ejecución completa del Método Húngaro.
 * Obtiene la matriz, la transforma si es de maximización, la equilibra con ficticios,
 * y aplica los pasos del algoritmo (reducir, cubrir ceros, ajustar matriz) hasta
 * encontrar la asignación óptima. Todos los pasos se registran para mostrarlos.
 * @param {boolean} esMaximizacion - Define si el problema es de maximización o minimización.
 */
function resolverMetodoHungaro(esMaximizacion) {
  const registroPasos = ["--- Inicio del Proceso del Método Húngaro ---"];

  registroPasos.push(
    `TIPO DE OPERACIÓN: ${esMaximizacion ? "MAXIMIZACIÓN" : "MINIMIZACIÓN"}`
  );

  const matrizOriginal = obtenerMatrizDeEntrada();
  let matrizDeTrabajo = matrizOriginal.map((fila) => [...fila]); // Paso 0: Mostrar la matriz original

  registroPasos.push("---------------------------------------------");
  registroPasos.push("Paso 0: Matriz Original");
  registroPasos.push(...matrizOriginal.map((fila) => fila.join("\t")));

  if (esMaximizacion) {
    registroPasos.push("---------------------------------------------");
    registroPasos.push("Convirtiendo matriz para maximización...");
    let valorMaximo = -Infinity;
    matrizDeTrabajo.forEach((fila) =>
      fila.forEach((valor) => {
        if (valor > valorMaximo) valorMaximo = valor;
      })
    );
    registroPasos.push(`Valor máximo en la matriz: ${valorMaximo}.`);
    matrizDeTrabajo = matrizDeTrabajo.map((fila) =>
      fila.map((valor) => valorMaximo - valor)
    );
    registroPasos.push(
      "Matriz de 'Costos de Oportunidad' generada:",
      ...matrizDeTrabajo.map((fila) => fila.join("\t"))
    );
  } // Cuadrar la matriz y mostrarla si se añadieron ficticios

  const filasOriginales = matrizDeTrabajo.length;
  const columnasOriginales = matrizDeTrabajo[0] ? matrizDeTrabajo[0].length : 0;
  const dimension = Math.max(filasOriginales, columnasOriginales);

  if (filasOriginales !== columnasOriginales) {
    matrizDeTrabajo.forEach((fila) => {
      while (fila.length < dimension) fila.push(0);
    });
    while (matrizDeTrabajo.length < dimension) {
      matrizDeTrabajo.push(Array(dimension).fill(0));
    }
    registroPasos.push("---------------------------------------------");
    registroPasos.push("Matriz con ficticio añadido:");
    registroPasos.push(...matrizDeTrabajo.map((fila) => fila.join("\t")));
  } // --- CAMBIO SOLICITADO: PRIMERO REDUCCIÓN DE FILAS ---

  registroPasos.push("---------------------------------------------");
  registroPasos.push("Paso 1: Reducción de Filas");
  matrizDeTrabajo.forEach((fila, i) => {
    const minimoFila = Math.min(...fila);
    if (minimoFila > 0) {
      registroPasos.push(`Restar ${minimoFila} de la fila ${i + 1}`);
      fila.forEach((_, j) => (fila[j] -= minimoFila));
    }
  });
  registroPasos.push("---------------------------------------------");
  registroPasos.push(
    "Matriz después de la reducción de filas:",
    ...matrizDeTrabajo.map((fila) => fila.join("\t"))
  ); // --- LUEGO REDUCCIÓN DE COLUMNAS ---

  registroPasos.push("---------------------------------------------");
  registroPasos.push("Paso 2: Reducción de Columnas");
  for (let j = 0; j < dimension; j++) {
    const columnaActual = matrizDeTrabajo.map((fila) => fila[j]);
    const minimoColumna = Math.min(...columnaActual);

    if (minimoColumna > 0) {
      registroPasos.push(`Restar ${minimoColumna} de la columna ${j + 1}`);
      for (let i = 0; i < dimension; i++)
        matrizDeTrabajo[i][j] -= minimoColumna;
    }
  }
  registroPasos.push("---------------------------------------------");
  registroPasos.push(
    "Matriz después de la reducción de columnas:",
    ...matrizDeTrabajo.map((fila) => fila.join("\t"))
  );

  let asignacionProvisional = {};
  while (true) {
    const { coberturas, cerosEstrellados } =
      encontrarLineasMinimas(matrizDeTrabajo);
    const numeroDeLineas =
      coberturas.fila.filter(Boolean).length +
      coberturas.columna.filter(Boolean).length;
    registroPasos.push("---------------------------------------------");
    registroPasos.push(
      `Intento de cobertura: Se encontraron ${numeroDeLineas} líneas.`
    );
    registroPasos.push("---------------------------------------------");
    if (numeroDeLineas >= dimension) {
      asignacionProvisional = cerosEstrellados;
      break;
    }
    registroPasos.push(
      "El número de líneas es menor que la dimensión. Se requiere ajustar la matriz."
    );
    ajustarMatriz(matrizDeTrabajo, coberturas, registroPasos);
  }

  const asignacionFinal = [];
  for (const fila in asignacionProvisional) {
    asignacionFinal.push([+fila, asignacionProvisional[fila]]);
  }

  let valorTotalOptimo = 0;
  const cadenaResultado = asignacionFinal.map(([r, c]) => {
    if (r < matrizOriginal.length && c < matrizOriginal[0].length) {
      valorTotalOptimo += matrizOriginal[r][c];
    }
    return `\n Fila ${r + 1} → Columna ${c + 1}`;
  });

  registroPasos.push("--- Asignación Final Óptima ---");
  registroPasos.push(`Asignaciones: ${cadenaResultado}`);
  const tipoResultado = esMaximizacion ? "Beneficio Máximo" : "Costo Mínimo";
  registroPasos.push(`${tipoResultado}: ${valorTotalOptimo}`);

  mostrarPasosEnLog(registroPasos);
}

/**
 * Encuentra el número mínimo de líneas para cubrir todos los ceros en la matriz.
 * Este es un paso fundamental del algoritmo que determina si se ha alcanzado la solución óptima.
 * Utiliza un sistema de marcado de ceros (estrellados y primados) para lograrlo.
 * @param {number[][]} matriz - La matriz de costos actual.
 * @returns {{coberturas: object, cerosEstrellados: object}} Un objeto con las líneas de cobertura y las asignaciones (ceros estrellados).
 */
function encontrarLineasMinimas(matriz) {
  const dimension = matriz.length;
  const cerosEstrellados = {};
  const filasCubiertas = Array(dimension).fill(false);
  const columnasCubiertas = Array(dimension).fill(false);

  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      if (matriz[i][j] === 0 && !columnasCubiertas[j]) {
        cerosEstrellados[i] = j;
        columnasCubiertas[j] = true;
        break;
      }
    }
  }

  columnasCubiertas.fill(false);
  for (const fila in cerosEstrellados) {
    columnasCubiertas[cerosEstrellados[fila]] = true;
  }

  if (Object.keys(cerosEstrellados).length >= dimension) {
    return {
      coberturas: { fila: filasCubiertas, columna: columnasCubiertas },
      cerosEstrellados,
    };
  }

  let cerosPrimados = {};
  while (true) {
    let ceroNoCubierto = buscarCeroNoCubierto(
      matriz,
      filasCubiertas,
      columnasCubiertas
    );
    if (!ceroNoCubierto) break;

    const [r, c] = ceroNoCubierto;
    cerosPrimados[r] = c;
    const estrellaEnFila = cerosEstrellados[r];

    if (estrellaEnFila !== undefined) {
      filasCubiertas[r] = true;
      columnasCubiertas[estrellaEnFila] = false;
    } else {
      let camino = [[r, c]];
      let filaActual = r;
      let columnaActual = c;
      while (true) {
        const filaEstrella = Object.keys(cerosEstrellados).find(
          (key) => cerosEstrellados[key] === columnaActual
        );
        if (filaEstrella === undefined) break;
        camino.push([parseInt(filaEstrella), columnaActual]);
        filaActual = parseInt(filaEstrella);
        columnaActual = cerosPrimados[filaActual];
        camino.push([filaActual, columnaActual]);
      }
      camino.forEach(([pr, pc]) => {
        if (cerosPrimados[pr] === pc) cerosEstrellados[pr] = pc;
      });
      filasCubiertas.fill(false);
      columnasCubiertas.fill(false);
      cerosPrimados = {};
      for (const fila in cerosEstrellados) {
        columnasCubiertas[cerosEstrellados[fila]] = true;
      }
    }
  }
  return {
    coberturas: { fila: filasCubiertas, columna: columnasCubiertas },
    cerosEstrellados,
  };
}

/**
 * Busca en la matriz un cero que no esté cubierto por ninguna línea.
 * @param {number[][]} matriz - La matriz de trabajo actual.
 * @param {boolean[]} filasCubiertas - Array que indica qué filas están cubiertas.
 * @param {boolean[]} columnasCubiertas - Array que indica qué columnas están cubiertas.
 * @returns {number[]|null} Las coordenadas [fila, columna] del cero encontrado, o null si no existe.
 */
function buscarCeroNoCubierto(matriz, filasCubiertas, columnasCubiertas) {
  for (let i = 0; i < matriz.length; i++) {
    if (!filasCubiertas[i]) {
      for (let j = 0; j < matriz.length; j++) {
        if (!columnasCubiertas[j] && matriz[i][j] === 0) return [i, j];
      }
    }
  }
  return null;
}

/**
 * Ajusta la matriz cuando no se encuentra una solución óptima (el número de líneas es menor que la dimensión).
 * Encuentra el valor mínimo no cubierto, lo resta de todos los elementos no cubiertos y
 * lo suma a los elementos cubiertos por dos líneas. Esto genera nuevos ceros para la siguiente iteración.
 * @param {number[][]} matriz - La matriz de trabajo que se va a ajustar.
 * @param {{fila: boolean[], columna: boolean[]}} coberturas - Objeto con las filas y columnas cubiertas.
 * @param {string[]} registroPasos - El log de pasos para registrar la operación.
 */
function ajustarMatriz(matriz, coberturas, registroPasos) {
  const dimension = matriz.length;
  let minimoNoCubierto = Infinity;
  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      if (
        !coberturas.fila[i] &&
        !coberturas.columna[j] &&
        matriz[i][j] < minimoNoCubierto
      ) {
        minimoNoCubierto = matriz[i][j];
      }
    }
  }
  registroPasos.push(`El menor valor no cubierto es ${minimoNoCubierto}.`);

  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      if (!coberturas.fila[i] && !coberturas.columna[j]) {
        matriz[i][j] -= minimoNoCubierto;
      } else if (coberturas.fila[i] && coberturas.columna[j]) {
        matriz[i][j] += minimoNoCubierto;
      }
    }
  }
  registroPasos.push(
    "Matriz después del ajuste:",
    ...matriz.map((fila) => fila.join("\t"))
  );
}