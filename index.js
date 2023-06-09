//Definimos las constantes para coger el canvas y el "contenido"
const canvas1 = document.querySelector("#canvas1");
const canvas2 = document.querySelector("#canvas2");
const contexto1 = canvas1.getContext('2d');
const contexto2 = canvas2.getContext('2d');

//Definimos la cantidad de columnas y filas de la cuadricula
const nColumnas = 11;
const nFilas = 11;

//Cogemos la altura y anchura de cada cuadradito
const anchoCasilla = canvas1.width / nFilas;
const alturaCasilla = canvas1.height / nColumnas;

const letras = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var barcos = [];

function dibujarCanvas(contexto, canvas) {
    //Dejamos el canavas con fondo blanco de manera predeterminada
    contexto.fillStyle = "white"; 
    contexto.fillRect(0, 0, canvas.width, canvas.height); 

    //Recorremos las filas y columnas
    for (let fila = 0; fila < nColumnas; fila++) {
        rellenarCelda(contexto, fila, 0, "lightgrey");
        for (let col = 0; col < nFilas; col++) {
            rellenarCelda(contexto, 0, fila, "lightgrey");
        }
    }

    pintarLetrasYNumeros(contexto);
}

function pintarLetrasYNumeros(contexto) {
    contexto.fillStyle = "black";
    contexto.font = "12px Arial";

    for (let fila = 0; fila < nColumnas; fila++) {
        for (let col = 0; col < nFilas; col++) {
            contexto.strokeRect(col * anchoCasilla, fila * alturaCasilla, anchoCasilla, alturaCasilla);
            if (col === 0) {
                contexto.textAlign = "center";
                contexto.fillText(letras[fila], anchoCasilla / 2, fila * alturaCasilla + alturaCasilla / 2);
            }
        }
        if (fila === 0) {
            for (let col = 1; col < nFilas; col++) {
                contexto.textAlign = "center";
                contexto.fillText(col, col * anchoCasilla + anchoCasilla / 2, alturaCasilla / 2);
            }
        }
    }
}

function inicio() {
    //Dibujamos el canvas de los dos jugadores
    dibujarCanvas(contexto1, canvas1);
    dibujarCanvas(contexto2, canvas2);
    cargarBarcos();
}

canvas2.addEventListener('click', marcar);

function marcar(event) {
    const x = event.clientX - canvas2.offsetLeft;
    const y = event.clientY - canvas2.offsetTop;
  
    const fila = Math.floor(y / alturaCasilla);
    const columna = Math.floor(x / anchoCasilla);

    if (fila > 0 && columna > 0) {
        disparo(contexto2, fila, columna, 'red');
    }
  
}

function disparo(contexto, fila, columna, color) {
    const x = fila * anchoCasilla; 
    const y = columna * alturaCasilla;
  
    contexto.fillStyle = color;
    contexto.fillRect(y, x, anchoCasilla, alturaCasilla);
}

function rellenarCelda(contexto, fila, col, color) {
    contexto.fillStyle = color;
    const x = col * anchoCasilla;
    const y = fila * alturaCasilla;
    contexto.fillRect(y, x, anchoCasilla, alturaCasilla);
}

function cargarBarcos() {
    fetch('barcos.json')
    .then(response => response.json())
    .then(data => {
        colocarBarcos(contexto1, data)
    })

}

function colocarBarcos(contexto, data) {
    barcos = rellenarArray(barcos);

    data.barcos.forEach(element => {
        const xNueva = Math.floor(Math.random()*11);
        const yNueva = Math.floor(Math.random()*11);
        const orientacion = (Math.floor(Math.random()*2) % 2 == 0)? "H" : "V";

        element.x = xNueva;
        element.y = yNueva;
        element.orientacion = orientacion;

        dibujarBarco(contexto, element.x, element.y, element.orientacion, element.vida);
        console.log(barcos);
    });
}

function dibujarBarco(contexto, x, y, orientacion, tamaño) {
    const color = 'blue'; 

    const xInicial = y * anchoCasilla;
    const yInicial = x * alturaCasilla;

    if (orientacion === 'H') {
        for (let i = 0; i < tamaño; i++) {
            const xActual = xInicial + i * anchoCasilla;
            contexto.fillStyle = color;
            contexto.fillRect(xActual, yInicial, anchoCasilla, alturaCasilla);
            barcos[x+i][y] = 'B'
        }
    } else if (orientacion === 'V') {
        for (let i = 0; i < tamaño; i++) {
            const yActual = yInicial + i * alturaCasilla;
            contexto.fillStyle = color;
            contexto.fillRect(xInicial, yActual, anchoCasilla, alturaCasilla);
            barcos[x][y+i] = 'B'
        }
    }
}

function rellenarArray(barcos) {

    var filas = 10;
    var columnas = 10;
    
    for (let fila = 0; fila < filas; fila++) {
        barcos[fila] = [];
    
        for (let columna = 0; columna < columnas; columna++) {
            barcos[fila][columna] = ""; 
        }
    }
    
    return barcos;
}