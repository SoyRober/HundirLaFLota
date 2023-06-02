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

function cargar() {
    fetch(url)
    .then(response => {

        if (response.ok) return response.json();
        else{
            alert("No s'ha pogut carregar. Error: " + response.status)
        }
    })

    .then(data => {
        pintarBarcos(data);
    });
}

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

    for (let fila = 0; fila < nColumnas; fila++) {
        for (let col = 0; col < nFilas; col++) {
            contexto.strokeRect(col * anchoCasilla, fila * alturaCasilla, anchoCasilla, alturaCasilla);

        }
    }

}

function rellenarCelda(contexto, fila, col, color, texto) {
    contexto.fillStyle = color;
    const x = col * anchoCasilla;
    const y = fila * alturaCasilla;
    contexto.fillRect(y, x, anchoCasilla, alturaCasilla);
}

function inicio() {
    //Dibujamos el canvas de los dos jugadores
    dibujarCanvas(contexto1, canvas1);
    dibujarCanvas(contexto2, canvas2);
}

canvas2.addEventListener('click', function(evento){
    const x = evento.clientX - canvas2.offsetLeft; 
    const y = evento.clientY - canvas2.offsetTop;

    const columna = Math.floor(x/anchoCasilla);
    const fila = Math.floor(y/alturaCasilla);

    if (fila > 0 && columna > 0) {
        
    }

});

function pintarBarcos(barco) {
    barco.forEach(element => {
        console.log(element)
    });
}