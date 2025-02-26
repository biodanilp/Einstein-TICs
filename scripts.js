// Banco de ejercicios y contadores de aciertos
const bancoEjercicios = {
    suma: [],
    resta: [],
    multiplicacion: [],
    division: []
};

const contadoresAciertos = {
    suma: 0,
    resta: 0,
    multiplicacion: 0,
    division: 0
};

// Generar ejercicios aleatorios
function generarBancoEjercicios() {
    for (let i = 0; i < 100; i++) {
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        bancoEjercicios.suma.push({ pregunta: `${a} + ${b} = ?`, respuesta: a + b });
        bancoEjercicios.resta.push({ pregunta: `${a + b} - ${b} = ?`, respuesta: a });
        bancoEjercicios.multiplicacion.push({ pregunta: `${a} x ${b} = ?`, respuesta: a * b });
        bancoEjercicios.division.push({ pregunta: `${a * b} ÷ ${b} = ?`, respuesta: a });
    }
}

// Iniciar un juego
function iniciarJuego(tipo) {
    // Ocultar todos los juegos primero
    document.querySelectorAll('.juego').forEach(juego => {
        juego.style.display = 'none';
    });

    // Mostrar el juego correspondiente
    document.getElementById(`juego${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = "block";
    mostrarEjercicio(tipo);
}

// Mostrar un ejercicio aleatorio
function mostrarEjercicio(tipo) {
    let index = Math.floor(Math.random() * bancoEjercicios[tipo].length);
    document.getElementById(`pregunta${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerText = bancoEjercicios[tipo][index].pregunta;
}

// Construir el edificio progresivamente
function construirEdificio(pisos) {
    const construccion = document.getElementById("construccionEdificio");
    construccion.innerHTML = ""; // Limpiar el edificio anterior

    for (let i = 0; i < pisos; i++) {
        const bloque = document.createElement("div");
        bloque.className = "bloque";
        bloque.style.bottom = `${i * 30}px`; // Espaciado entre pisos
        construccion.appendChild(bloque);
    }
}

// Verificar la respuesta del usuario
function verificarRespuesta(tipo) {
    let input = document.getElementById(`respuesta${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    let resultado = document.getElementById(`resultado${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    let mensajeAciertos = document.getElementById(`mensajeAciertos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    let respuestaCorrecta = bancoEjercicios[tipo].find(ej => ej.pregunta === document.getElementById(`pregunta${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerText).respuesta;

    if (parseInt(input.value) === respuestaCorrecta) {
        resultado.innerHTML = "✅ ¡Correcto!";
        contadoresAciertos[tipo]++;
        mensajeAciertos.innerText = `Aciertos: ${contadoresAciertos[tipo]}/3`;

        // Construir el edificio progresivamente en el reto de suma
        if (tipo === "suma") {
            construirEdificio(contadoresAciertos[tipo]);
        }

        if (contadoresAciertos[tipo] === 3) {
            mostrarRecompensa(tipo); // Mostrar recompensa solo después de 3 aciertos
            contadoresAciertos[tipo] = 0; // Reiniciar contador
            mensajeAciertos.innerText = ""; // Limpiar mensaje
            document.getElementById(`juego${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = "none"; // Ocultar juego
        } else {
            mostrarEjercicio(tipo); // Mostrar siguiente ejercicio
        }
    } else {
        resultado.innerHTML = "❌ Inténtalo de nuevo.";
        contadoresAciertos[tipo] = 0; // Reiniciar contador
        mensajeAciertos.innerText = ""; // Limpiar mensaje

        // Reiniciar el edificio si el usuario falla
        if (tipo === "suma") {
            construirEdificio(0); // Limpiar el edificio
        }
    }
    input.value = ""; // Limpiar el campo de entrada
}

// Mostrar recompensa según el tipo de juego
function mostrarRecompensa(tipo) {
    if (tipo === "suma") mostrarConstruccion();
    else if (tipo === "resta") mostrarLaberinto();
    else if (tipo === "multiplicacion") mostrarCarrera();
    else if (tipo === "division") mostrarMemoria();
}

// Funciones de recompensas (animaciones)
function mostrarConstruccion() {
    const recompensa = document.getElementById("recompensaSuma");
    const construccion = document.getElementById("construccionEdificio");
    recompensa.style.display = "flex";

    // Construir el edificio completo (3 pisos) como recompensa
    construirEdificio(3);

    setTimeout(() => {
        recompensa.style.display = "none";
        construccion.innerHTML = ""; // Limpiar el edificio
    }, 3000);
}

function mostrarLaberinto() {
    const recompensa = document.getElementById("recompensaResta");
    const laberinto = document.getElementById("laberintoPirata");
    recompensa.style.display = "flex";

    for (let i = 0; i < 25; i++) {
        const celda = document.createElement("div");
        celda.className = "celda";
        celda.innerText = i % 5 === 0 ? "🚩" : "";
        laberinto.appendChild(celda);
    }

    setTimeout(() => {
        recompensa.style.display = "none";
        laberinto.innerHTML = "";
    }, 3000);
}

function mostrarCarrera() {
    const recompensa = document.getElementById("recompensaMultiplicacion");
    const nave = document.getElementById("naveCarrera");
    recompensa.style.display = "flex";

    let posicion = 0;
    const intervalo = setInterval(() => {
        posicion += 10;
        nave.style.left = `${posicion}px`;
        if (posicion >= 300) {
            clearInterval(intervalo);
            setTimeout(() => {
                recompensa.style.display = "none";
                nave.style.left = "0";
            }, 1000);
        }
    }, 100);
}

function mostrarMemoria() {
    const recompensa = document.getElementById("recompensaDivision");
    const memoria = document.getElementById("memoriaDivision");
    recompensa.style.display = "flex";

    const cartas = [1, 2, 3, 4, 1, 2, 3, 4];
    cartas.sort(() => Math.random() - 0.5);

    cartas.forEach((valor, index) => {
        const carta = document.createElement("div");
        carta.className = "carta";
        carta.dataset.valor = valor;
        carta.dataset.index = index;
        carta.innerText = "?";
        carta.addEventListener("click", voltearCarta);
        memoria.appendChild(carta);
    });
}

let cartasVolteadas = [];
function voltearCarta(event) {
    const carta = event.target;
    if (cartasVolteadas.length < 2 && !carta.classList.contains("volteada")) {
        carta.innerText = carta.dataset.valor;
        carta.classList.add("volteada");
        cartasVolteadas.push(carta);

        if (cartasVolteadas.length === 2) {
            verificarPareja();
        }
    }
}

function verificarPareja() {
    const [carta1, carta2] = cartasVolteadas;
    if (carta1.dataset.valor === carta2.dataset.valor) {
        cartasVolteadas = [];
        if (document.querySelectorAll(".carta.volteada").length === 8) {
            setTimeout(() => {
                alert("¡Felicidades! Has encontrado todas las parejas.");
                document.getElementById("recompensaDivision").style.display = "none";
            }, 500);
        }
    } else {
        setTimeout(() => {
            carta1.innerText = "?";
            carta2.innerText = "?";
            carta1.classList.remove("volteada");
            carta2.classList.remove("volteada");
            cartasVolteadas = [];
        }, 1000);
    }
}

// Generar ejercicios al cargar la página
generarBancoEjercicios();
