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
    document.getElementById(`juego${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = "block";
    mostrarEjercicio(tipo);
}

// Mostrar un ejercicio aleatorio
function mostrarEjercicio(tipo) {
    let index = Math.floor(Math.random() * bancoEjercicios[tipo].length);
    document.getElementById(`pregunta${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerText = bancoEjercicios[tipo][index].pregunta;
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

        if (contadoresAciertos[tipo] === 3) {
            mostrarRecompensa(tipo);
            contadoresAciertos[tipo] = 0;
            mensajeAciertos.innerText = "";
        } else {
            mostrarEjercicio(tipo);
        }
    } else {
        resultado.innerHTML = "❌ Inténtalo de nuevo.";
        contadoresAciertos[tipo] = 0;
        mensajeAciertos.innerText = "";
    }
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

    for (let i = 0; i < 10; i++) {
        const bloque = document.createElement("div");
        bloque.className = "bloque";
        bloque.style.bottom = `${i * 20}px`;
        construccion.appendChild(bloque);
    }

    setTimeout(() => {
        recompensa.style.display = "none";
        construccion.innerHTML = "";
    }, 3000);
}

// ... (resto de las funciones de recompensas) ...

// Generar ejercicios al cargar la página
generarBancoEjercicios();