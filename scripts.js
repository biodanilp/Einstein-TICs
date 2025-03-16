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

function mostrarConstruccion() {
    const recompensa = document.getElementById("recompensaSuma");
    const construccion = document.getElementById("construccionEdificio");
    recompensa.style.display = "flex";
    construccion.innerHTML = "";
    
    // Crear base del edificio
    const base = document.createElement("div");
    base.className = "edificio-base";
    construccion.appendChild(base);
    
    // Añadir bloques con animación secuencial
    const totalBloques = 5;
    
    for (let i = 0; i < totalBloques; i++) {
        setTimeout(() => {
            const bloque = document.createElement("div");
            bloque.className = "bloque";
            bloque.style.bottom = `${i * 40 + 20}px`;
            
            // Añadir ventanas al bloque
            for (let j = 0; j < 3; j++) {
                const ventana = document.createElement("div");
                ventana.className = "ventana";
                ventana.style.left = `${j * 30 + 25}px`;
                bloque.appendChild(ventana);
            }
            
            construccion.appendChild(bloque);
            
            // Reproducir sonido
            const sonido = new Audio('https://assets.mixkit.co/active_storage/sfx/211/211-preview.mp3');
            sonido.volume = 0.2;
            sonido.play().catch(e => console.log("Audio no pudo reproducirse: ", e));
            
            // Añadir techo al final
            if (i === totalBloques - 1) {
                setTimeout(() => {
                    const techo = document.createElement("div");
                    techo.className = "techo";
                    techo.style.bottom = `${totalBloques * 40 + 20}px`;
                    construccion.appendChild(techo);
                    
                    // Mostrar mensaje de felicitación con confeti
                    mostrarConfeti();
                    
                    // Añadir mensaje de recompensa
                    setTimeout(() => {
                        const mensajeRecompensa = document.createElement("div");
                        mensajeRecompensa.className = "mensaje-recompensa";
                        mensajeRecompensa.innerHTML = "¡Increíble! Has construido un magnífico edificio. Ahora, ve con Andrea para reclamar un delicioso caramelo y prepárate para enfrentar nuevos retos";
                        construccion.parentNode.appendChild(mensajeRecompensa);
                    }, 1000);
                }, 500);
            }
        }, i * 600);
    }

    setTimeout(() => {
        recompensa.style.display = "none";
    }, 50000); // Aumenté el tiempo para que el mensaje sea visible
}

function mostrarConfeti() {
    for (let i = 0; i < 50; i++) {
        const confeti = document.createElement("div");
        confeti.className = "confeti";
        confeti.style.left = `${Math.random() * 100}%`;
        confeti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        confeti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confeti);
        
        setTimeout(() => {
            confeti.remove();
        }, 3000);
    }
}
function mostrarLaberinto() {
    const recompensa = document.getElementById("recompensaResta");
    const laberinto = document.getElementById("laberintoPirata");
    recompensa.style.display = "flex";
    laberinto.innerHTML = "";
    
    // Crear estructura del laberinto 5x5
    const estructuraLaberinto = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ];
    
    // Definir posición inicial del pirata y del tesoro
    const pirataPosInicial = { x: 1, y: 1 };
    const tesoroPosicion = { x: 3, y: 3 };
    let pirataPos = { ...pirataPosInicial };
    
    // Crear celdas del laberinto
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const celda = document.createElement("div");
            celda.className = "celda";
            
            // Asignar contenido a la celda según su posición
            if (estructuraLaberinto[y][x] === 1) {
                // Muro
                celda.classList.add("muro");
                celda.innerHTML = "🌊";
            } else if (x === tesoroPosicion.x && y === tesoroPosicion.y) {
                // Tesoro
                celda.classList.add("tesoro");
                celda.innerHTML = "💰";
            } else if (x === pirataPosInicial.x && y === pirataPosInicial.y) {
                // Pirata
                celda.classList.add("pirata");
                celda.id = "pirata";
                celda.innerHTML = "🏴‍☠️";
            } else {
                // Camino
                celda.classList.add("camino");
                celda.innerHTML = "";
            }
            
            laberinto.appendChild(celda);
        }
    }
    
    // Añadir controles de navegación
    const controles = document.createElement("div");
    controles.className = "controles-laberinto";
    
    const arriba = document.createElement("button");
    arriba.innerHTML = "↑";
    arriba.onclick = () => moverPirata(0, -1);
    
    const abajo = document.createElement("button");
    abajo.innerHTML = "↓";
    abajo.onclick = () => moverPirata(0, 1);
    
    const izquierda = document.createElement("button");
    izquierda.innerHTML = "←";
    izquierda.onclick = () => moverPirata(-1, 0);
    
    const derecha = document.createElement("button");
    derecha.innerHTML = "→";
    derecha.onclick = () => moverPirata(1, 0);
    
    controles.appendChild(arriba);
    controles.appendChild(izquierda);
    controles.appendChild(abajo);
    controles.appendChild(derecha);
    
    laberinto.appendChild(controles);
    
    // Función para mover al pirata
    function moverPirata(dx, dy) {
        const nuevaX = pirataPos.x + dx;
        const nuevaY = pirataPos.y + dy;
        
        // Verificar que el movimiento sea válido
        if (
            nuevaX >= 0 && nuevaX < 5 && 
            nuevaY >= 0 && nuevaY < 5 && 
            estructuraLaberinto[nuevaY][nuevaX] !== 1
        ) {
            // Eliminar pirata de la posición anterior
            const celdaAnterior = laberinto.children[pirataPos.y * 5 + pirataPos.x];
            celdaAnterior.innerHTML = "";
            celdaAnterior.classList.remove("pirata");
            
            // Actualizar posición
            pirataPos = { x: nuevaX, y: nuevaY };
            
            // Colocar pirata en nueva posición
            const nuevaCelda = laberinto.children[nuevaY * 5 + nuevaX];
            nuevaCelda.classList.add("pirata");
            nuevaCelda.innerHTML = "🏴‍☠️";
            
            // Verificar si llegó al tesoro
            if (nuevaX === tesoroPosicion.x && nuevaY === tesoroPosicion.y) {
                setTimeout(() => {
                    celebrarTesoroEncontrado();
                }, 500);
            }
        }
    }
    
    function celebrarTesoroEncontrado() {
        // Animación de celebración
        const tesoroCelda = laberinto.children[tesoroPosicion.y * 5 + tesoroPosicion.x];
        tesoroCelda.innerHTML = "🎉";
        
        // Crear mensaje de celebración
        const mensaje = document.createElement("div");
        mensaje.className = "mensaje-tesoro";
        mensaje.innerHTML = "¡Tesoro encontrado!";
        laberinto.appendChild(mensaje);
        
        // Sonido de celebración
        const sonido = new Audio('https://assets.mixkit.co/active_storage/sfx/220/220-preview.mp3');
        sonido.volume = 0.2;
        sonido.play().catch(e => console.log("Audio no pudo reproducirse: ", e));
        
        // Mostrar monedas de oro como recompensa
        mostrarMonedasOro();
        
        setTimeout(() => {
            recompensa.style.display = "none";
        }, 3000);
    }
    
    function mostrarMonedasOro() {
        for (let i = 0; i < 20; i++) {
            const moneda = document.createElement("div");
            moneda.className = "moneda-oro";
            moneda.style.left = `${Math.random() * 100}%`;
            moneda.style.top = `${Math.random() * 100}%`;
            moneda.innerHTML = "💰";
            recompensa.appendChild(moneda);
            
            setTimeout(() => {
                moneda.remove();
            }, 3000);
        }
    }
}

function mostrarCarrera() {
    const recompensa = document.getElementById("recompensaMultiplicacion");
    const carrera = document.querySelector("#recompensaMultiplicacion .carrera");
    recompensa.style.display = "flex";
    carrera.innerHTML = "";
    
    // Crear pista de carrera espacial
    const pista = document.createElement("div");
    pista.className = "pista-espacial";
    carrera.appendChild(pista);
    
    // Crear nave del jugador
    const naveJugador = document.createElement("div");
    naveJugador.className = "nave-jugador";
    naveJugador.innerHTML = "🚀";
    pista.appendChild(naveJugador);
    
    // Crear nave rival
    const naveRival = document.createElement("div");
    naveRival.className = "nave-rival";
    naveRival.innerHTML = "👾";
    pista.appendChild(naveRival);
    
    // Crear estrellas de fondo
    for (let i = 0; i < 50; i++) {
        const estrella = document.createElement("div");
        estrella.className = "estrella";
        estrella.style.left = `${Math.random() * 100}%`;
        estrella.style.top = `${Math.random() * 100}%`;
        estrella.style.animationDuration = `${Math.random() * 3 + 1}s`;
        pista.appendChild(estrella);
    }
    
    // Línea de meta
    const meta = document.createElement("div");
    meta.className = "linea-meta";
    pista.appendChild(meta);
    
    // Contador para la animación
    let posicionNave = 0;
    let posicionRival = 0;
    const velocidadJugador = 2.5;
    const velocidadRival = 2;
    const distanciaMeta = 95;  // Porcentaje de la pista
    
    // Función de animación
    function animarCarrera() {
        posicionNave += velocidadJugador;
        posicionRival += velocidadRival;
        
        naveJugador.style.left = `${posicionNave}%`;
        naveRival.style.left = `${posicionRival}%`;
        
        // Verificar si alguna nave ha llegado a la meta
        if (posicionNave >= distanciaMeta) {
            clearInterval(animacionId);
            celebrarVictoria();
        }
        
        // Crear efecto de propulsión para la nave
        if (Math.random() > 0.7) {
            const propulsion = document.createElement("div");
            propulsion.className = "propulsion";
            propulsion.style.left = `${posicionNave - 3}%`;
            propulsion.style.top = `${parseInt(naveJugador.style.top) + 20}px`;
            pista.appendChild(propulsion);
            
            setTimeout(() => {
                propulsion.remove();
            }, 500);
        }
    }
    
    // Iniciar animación
    const animacionId = setInterval(animarCarrera, 50);
    
   function celebrarVictoria() {
    // Animar nave ganadora
    naveJugador.classList.add("ganador");
    
    // Crear mensaje de victoria
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-victoria";
    mensaje.innerHTML = "¡Has ganado la carrera!";
    carrera.appendChild(mensaje);
    
    // Reproducir sonido de victoria
    const sonido = new Audio('https://assets.mixkit.co/active_storage/sfx/890/890-preview.mp3');
    sonido.volume = 0.2;
    sonido.play().catch(e => console.log("Audio no pudo reproducirse: ", e));
    
    // Mostrar fuegos artificiales
    lanzarFuegosArtificiales();
    
    // Añadir mensaje de recompensa
    setTimeout(() => {
        const mensajeRecompensa = document.createElement("div");
        mensajeRecompensa.className = "mensaje-recompensa";
        mensajeRecompensa.innerHTML = "¡Asombroso! Has completado este desafío con éxito. Corre a reclamar tu obsequio con Selenne y regresa listo para enfrentar el último reto";
        carrera.appendChild(mensajeRecompensa);
    }, 15000);
    
    setTimeout(() => {
        recompensa.style.display = "none";
    }, 6000); // Aumentado para dar tiempo a leer el mensaje
}
    
    function lanzarFuegosArtificiales() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const fuego = document.createElement("div");
                fuego.className = "fuego-artificial";
                fuego.style.left = `${Math.random() * 100}%`;
                fuego.style.top = `${Math.random() * 40 + 10}%`;
                
                const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                fuego.style.backgroundColor = color;
                
                carrera.appendChild(fuego);
                
                setTimeout(() => {
                    fuego.remove();
                    
                    // Crear explosión
                    for (let j = 0; j < 20; j++) {
                        const particula = document.createElement("div");
                        particula.className = "particula";
                        particula.style.left = fuego.style.left;
                        particula.style.top = fuego.style.top;
                        particula.style.backgroundColor = color;
                        particula.style.transform = `rotate(${j * 18}deg)`;
                        carrera.appendChild(particula);
                        
                        setTimeout(() => {
                            particula.remove();
                        }, 1000);
                    }
                }, 500);
            }, i * 300);
        }
    }
}

// Variables para el juego de memoria
let cartasVolteadas = [];
let paresEncontrados = 0;

// Función para mostrar el juego de memoria (División)
function mostrarMemoria() {
    const recompensa = document.getElementById("recompensaDivision");
    const memoria = document.getElementById("memoriaDivision");
    recompensa.style.display = "flex";
    memoria.innerHTML = "";
    
    // Crear pares de divisiones y resultados
    const pares = [];
    for (let i = 1; i <= 4; i++) {
        const divisor = Math.floor(Math.random() * 5) + 1;
        const resultado = i;
        const dividendo = divisor * resultado;
        
        // Añadir la operación y su resultado como un par
        pares.push({
            id: i,
            tipo: 'operacion',
            valor: `${dividendo} ÷ ${divisor}`,
            pareja: i
        });
        
        pares.push({
            id: i + 4,
            tipo: 'resultado',
            valor: `${resultado}`,
            pareja: i
        });
    }
    
    // Barajar los pares
    const paresBarajados = pares.sort(() => Math.random() - 0.5);
    
    // Crear las cartas en el DOM
    paresBarajados.forEach(par => {
        const carta = document.createElement("div");
        carta.className = "carta";
        carta.dataset.id = par.id;
        carta.dataset.pareja = par.pareja;
        
        // El contenido se mostrará al voltear
        const contenidoFrente = document.createElement("div");
        contenidoFrente.className = "contenido frente";
        contenidoFrente.innerHTML = "?";
        
        const contenidoReverso = document.createElement("div");
        contenidoReverso.className = "contenido reverso";
        contenidoReverso.innerHTML = par.valor;
        
        carta.appendChild(contenidoFrente);
        carta.appendChild(contenidoReverso);
        
        // Añadir evento de clic
        carta.addEventListener("click", voltearCarta);
        
        memoria.appendChild(carta);
    });
}

// Función para voltear una carta
function voltearCarta() {
    // Si ya hay dos cartas volteadas, no hacer nada
    if (cartasVolteadas.length >= 2) return;
    
    // Si la carta ya está volteada, no hacer nada
    if (this.classList.contains("volteada")) return;
    
    // Voltear la carta
    this.classList.add("volteada");
    cartasVolteadas.push(this);
    
    // Si hay dos cartas volteadas, verificar si son pareja
    if (cartasVolteadas.length === 2) {
        setTimeout(verificarPareja, 1000);
    }
}

// Función para verificar si las cartas volteadas son pareja
function verificarPareja() {
    const carta1 = cartasVolteadas[0];
    const carta2 = cartasVolteadas[1];
    
    // Si las cartas tienen la misma pareja, mantenerlas volteadas
    if (carta1.dataset.pareja === carta2.dataset.pareja) {
        carta1.classList.add("encontrada");
        carta2.classList.add("encontrada");
        paresEncontrados++;
        
        // Verificar si se han encontrado todos los pares
        if (paresEncontrados === 4) {
            setTimeout(() => {
                // Reproducir sonido de victoria cuando se completa el juego
                reproducirSonidoVictoria();
                
                mostrarCelebracion();
                setTimeout(() => {
                    document.getElementById("recompensaDivision").style.display = "none";
                    paresEncontrados = 0;
                }, 3000);
            }, 500);
        }
    } else {
        // Si no son pareja, voltearlas de nuevo
        carta1.classList.remove("volteada");
        carta2.classList.remove("volteada");
    }
    
    // Limpiar el array de cartas volteadas
    cartasVolteadas = [];
}

// Función para reproducir sonido de victoria
function reproducirSonidoVictoria() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
    audio.volume = 0.7; // Volumen al 70%
    audio.play().catch(e => console.log('Error al reproducir sonido de victoria:', e));
}

// Función para mostrar celebración al completar el juego
function mostrarCelebracion() {
    const memoria = document.getElementById("memoriaDivision");
    
    // Crear efecto de celebración
    for (let i = 0; i < 50; i++) {
        const confeti = document.createElement("div");
        confeti.className = "confeti";
        confeti.style.left = `${Math.random() * 100}%`;
        confeti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confeti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        memoria.appendChild(confeti);
    }
    
    // Mensaje de felicitación
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-celebracion";
    mensaje.textContent = "¡Felicidades! ¡Has encontrado todas las parejas!";
    memoria.appendChild(mensaje);
}

// Generar ejercicios al cargar la página
generarBancoEjercicios();
