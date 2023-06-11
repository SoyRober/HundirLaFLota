const canvas1 = document.querySelector("#canvas1");
const canvas2 = document.querySelector("#canvas2");
const contexto1 = canvas1.getContext("2d");
const contexto2 = canvas2.getContext("2d");
const log = document.querySelector("#log");

const nCols = 11;
const nFilas = 11;
const anchoCasilla = canvas1.width / nFilas; // Ancho de cada casilla del tablero
const alturaCasilla = canvas1.height / nCols; // Altura de cada casilla del tablero

const letras = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

var clicJugador1 = false; // Variable que indica si es el turno del jugador
const tableroJugador = crearArray();
const tableroMaquina = crearArray();

// Variable para almacenar los barcos del jugador
var barcosJugador;
// Variable para almacenar los barcos de la máquina
var barcosMaquina;

// Array para almacenar los nombres de los barcos hundidos de la máquina
var barcoHundidoMaquina = [];
// Array para almacenar los nombres de los barcos hundidos del jugador
var barcoHundidoJugador = [];

var finalPartida = false; // Variable que indica si la partida ha finalizado

// Dibuja el canvas con las cuadrículas y las letras/números
function dibujarCanvas(contexto, canvas) {
  // Establece el color de relleno del contexto en negro
  contexto.fillStyle = "white";
  // Rellena el canvas completo con el color de relleno
  contexto.fillRect(0, 0, canvas.width, canvas.height);

  for (let fila = 0; fila < nCols; fila++) {
    // Rellena la primera columna de cada fila con un color gris claro
    rellenarCelda(contexto, fila, 0, "lightgrey");
    for (let col = 0; col < nFilas; col++) {
      // Rellena la primera fila de cada columna con un color gris claro
      rellenarCelda(contexto, 0, fila, "lightgrey");
    }
  }

  pintarLetrasYNumeros(contexto);
}

// Pinta las letras y los números en las casillas correspondientes
function pintarLetrasYNumeros(contexto) {
  // Establece el color de relleno del contexto en negro
  contexto.fillStyle = "black";
  // Establece la fuente y el tamaño de la fuente
  contexto.font = "12px Arial";
  // Establece la alineación del texto en el centro

  contexto.textAlign = "center";

  // Itera sobre las filas del tablero
  for (let fila = 0; fila < nCols; fila++) {
    // Itera sobre las columnas del tablero
    for (let col = 0; col < nFilas; col++) {
      // Dibuja un borde alrededor de la casilla
      contexto.strokeRect(
        col * anchoCasilla,
        fila * alturaCasilla,
        anchoCasilla,
        alturaCasilla
      );

      // Verifica si es la columna de las letras
      if (col === 1) {
        contexto.fillText(
          letras[fila],
          anchoCasilla / 2,
          fila * alturaCasilla + alturaCasilla / 2
        );
      }
    }

    // Verifica si es la fila de los números

    if (fila === 1) {
      // Itera sobre las columnas del tablero
      for (let col = 1; col < nFilas; col++) {
        // Dibuja el número en el centro horizontal de la casilla
        contexto.fillText(
          col,
          col * anchoCasilla + anchoCasilla / 2,
          alturaCasilla / 2
        );
      }
    }
  }
}

// Inicializa el juego
function inicio() {
  dibujarCanvas(contexto1, canvas1);
  dibujarCanvas(contexto2, canvas2);
  cargarBarcosJugador(contexto1);
  cargarBarcosMaquina();
}

// Carga los barcos del jugador desde un archivo JSON
function cargarBarcosJugador(contexto) {
  fetch("barcosJugador.json")
    .then((response) => response.json())
    .then((data) => {
      barcosJugador = data;
      colocarBarcos(data, contexto);
    });
}

// Carga los barcos de la máquina desde un archivo JSON
function cargarBarcosMaquina() {
  fetch("barcosMaquina.json")
    .then((response) => response.json())
    .then((data) => {
      barcosMaquina = data;
      colocarBarcos(data);
    });
}

// Realiza un disparo inteligente de la máquina
function disparoAleatorio() {
  // Verifica si es el turno del jugador 1
  if (clicJugador1) {
    // Genera coordenadas aleatorias para el disparo
    var col = Math.floor(Math.random() * 11);
    var fila = Math.floor(Math.random() * 11);

    // Verifica si la columna o la fila es igual a 0 y las incrementa en 1
    if (col == 0) col++;
    if (fila == 0) fila++;

    // Verifica el resultado del disparo en la casilla seleccionada
    if (tableroJugador[col][fila] === "X") {
      // Si la casilla ya ha sido disparada, realiza otro disparo aleatorio
      disparoAleatorio();
    } else if (tableroJugador[col][fila] === "B") {
      // Si se acierta un barco del jugador, se marca como tocado en el tablero y se registra en el registro
      rellenarCelda(contexto1, fila, col, "yellow");
      tableroJugador[col][fila] = "X";
      log.value += "Tocado por la máquina.\n";

      // Verifica si el barco ha sido hundido
      barcosJugador.barcos.forEach((barco) => {
        if (verificarHundimiento(tableroJugador, barco)) {
          // Si el barco ha sido hundido, se agrega al registro y se muestra un mensaje
          if (buscarSiHaSidoHundido(barco.nombre, barcoHundidoMaquina)) {
            barcoHundidoMaquina.push(barco.nombre);
            log.value += `¡El barco ${barco.nombre} se ha hundido por la máquina!\n`;
          }
        }
      });

      // Cambia el turno al jugador 2
      clicJugador1 = false;
    } else {
      // Si no se acierta un barco, se marca como agua en el tablero y cambia el turno al jugador 2
      rellenarCelda(contexto1, fila, col, "blue");
      tableroJugador[col][fila] = "X";
      clicJugador1 = false;
      log.value += "Agua para la máquina!\n";
    }

    // Verifica si la máquina ha ganado
    if (barcoHundidoMaquina.length === 5) {
      log.value += "La máquina ha ganado ha ganado!";
      finalPartida = true;
    }
  }
}

// Verifica si un barco ha sido hundido
function verificarHundimiento(tablero, barco) {
  // Obtiene las posiciones del barco
  const posiciones = barco.posiciones;

  // Itera sobre cada posición del barco
  for (let i = 0; i < posiciones.length; i++) {
    // Obtiene la fila y columna de la posición actual
    const fila = posiciones[i].fila;
    const col = posiciones[i].col;

    // Verifica si la casilla en el tablero no ha sido marcada como "X" (tocado)
    if (tablero[col][fila] !== "X") {
      // Si encuentra una casilla no marcada, retorna falso indicando que el barco no ha sido hundido
      return false;
    }
  }

  // Si todas las casillas del barco han sido marcadas como "X", retorna true indicando que el barco ha sido hundido
  return true;
}

// Maneja el evento de clic en el canvas de la máquina
canvas2.addEventListener("click", function (event) {
  // Verifica si la partida ha finalizado
  if (!finalPartida) {
    // Obtiene las coordenadas del clic relativas al canvas
    const rect = canvas2.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calcula la columna y fila correspondientes a las coordenadas del clic
    const col = Math.floor(x / anchoCasilla);
    const fila = Math.floor(y / alturaCasilla);

    // Verifica si el clic está dentro del tablero (columna > 0, fila > 0)
    if (col > 0 && fila > 0) {
      // Verifica el contenido de la casilla en el tablero de la máquina
      if (tableroMaquina[col][fila] === "X") {
        // Si la casilla ya ha sido disparada, muestra un mensaje en el registro
        log.value += "No puedes volver a darle a la misma posición jugador.\n";
      } else if (tableroMaquina[col][fila] === "B") {
        // Si se acierta un barco de la máquina, marca la casilla como tocada en el canvas y registra el evento
        log.value += "Tocado por el jugador.\n";
        rellenarCelda(contexto2, col, fila, "yellow");
        tableroMaquina[col][fila] = "X";

        // Verifica si el barco ha sido hundido
        barcosMaquina.barcos.forEach((barco) => {
          if (verificarHundimiento(tableroMaquina, barco)) {
            // Si el barco ha sido hundido, lo agrega al registro y muestra un mensaje
            if (buscarSiHaSidoHundido(barco.nombre, barcoHundidoJugador)) {
              barcoHundidoJugador.push(barco.nombre);
              log.value += `¡El barco ${barco.nombre} se ha hundido por el jugador!\n`;
            }
          }
        });

        // Cambia el turno al jugador 1 y realiza un disparo aleatorio de la máquina
        clicJugador1 = true;
        disparoAleatorio();
      } else {
        // Si no se acierta un barco, marca la casilla como agua en el canvas y cambia el turno al jugador 1
        rellenarCelda(contexto2, col, fila, "blue");
        tableroMaquina[col][fila] = "X";
        clicJugador1 = true;
        log.value += "Agua para el jugador!\n";
        setTimeout(disparoAleatorio, 1000);
      }

      // Verifica si el jugador ha ganado
      if (barcoHundidoJugador.length === 5) {
        log.value += "El jugador ha ganado!";
        finalPartida = true;
      }
      autoScroll();
    }
  }
});

// Verifica si un barco ya ha sido hundido
function buscarSiHaSidoHundido(nombre, barcoHundido) {
  // Recorre todos los barcos hundidos
  for (let i = 0; i < barcoHundido.length; i++) {
    // Compara el nombre del barco hundido con el nombre buscado
    if (barcoHundido[i] === nombre) {
      // Si encuentra el nombre del barco en el array de barcos hundidos, retorna falso (ya ha sido hundido)
      return false;
    }
  }

  // Si no encuentra el nombre del barco en el array de barcos hundidos, retorna verdadero (no ha sido hundido)
  return true;
}

// Rellena una celda del tablero con un color
function rellenarCelda(contexto, col, fila, color) {
  // Establece el color de relleno del contexto
  contexto.fillStyle = color;

  // Calcula las coordenadas de la celda en el canvas
  const x = col * anchoCasilla;
  const y = fila * alturaCasilla;

  // Rellena la celda con el color especificado
  contexto.fillRect(x, y, anchoCasilla, alturaCasilla);
}

// Crea un array para el tablero de juego
function crearArray() {
  // Crea un array de tamaño nFilas para representar las filas del tablero
  var tablero = new Array(nFilas);

  // Recorre cada fila del tablero
  for (let i = 0; i < 11; i++) {
    // Crea un array de tamaño nCols para representar las columnas de cada fila
    tablero[i] = new Array(nCols);
  }

  // Recorre cada posición del tablero y la inicializa con una cadena vacía
  for (let i = 0; i < tablero.length; i++) {
    for (let j = 0; j < tablero[i].length; j++) {
      tablero[i][j] = "";
    }
  }

  // Devuelve el tablero creado
  return tablero;
}

// Coloca los barcos en el tablero de juego
function colocarBarcos(barcos, contexto) {
  // Recorre cada barco del array de barcos
  barcos.barcos.forEach((barco) => {
    const posiciones = barco.posiciones;

    // Recorre cada posición del barco
    posiciones.forEach((posicion) => {
      const fila = posicion.fila;
      const col = posicion.col;

      const x = col * anchoCasilla;
      const y = fila * alturaCasilla;

      // Si el contexto está definido, significa que se está colocando los barcos del jugador
      if (contexto !== undefined) {
        // Marca la posición del barco en el tablero del jugador
        tableroJugador[col][fila] = "B";
        // Rellena la celda correspondiente en el contexto con el color turquesa
        rellenarCelda(contexto, fila, col, "turquoise");
      } else {
        // Si no, se está colocando los barcos de la máquina
        // Marca la posición del barco en el tablero de la máquina
        tableroMaquina[col][fila] = "B";
      }
    });
  });
}

// Función principal de inicio del juego
function inicio() {
  dibujarCanvas(contexto1, canvas1);
  dibujarCanvas(contexto2, canvas2);
  cargarBarcosJugador(contexto1);
  cargarBarcosMaquina();
}

// Inicializa el juego al cargar la página
inicio();

// Función para desplazar automáticamente hacia abajo el textarea
function autoScroll() {
  log.scrollTop = log.scrollHeight;
}