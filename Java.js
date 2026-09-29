/* =====================================================
   HORARIOS Y RESERVAS
   ===================================================== */


/*
   Creamos los horarios desde las 7 de la mañana
   hasta las 6 de la tarde.

   El número 19 no se incluye.
*/
const horarios = generarHorarios(7, 19);


/*
   Recuperamos las reservas que ya estén guardadas
   en el navegador.

   Si todavía no existen reservas, utilizamos
   un objeto vacío {}.
*/
const reservas =
    JSON.parse(localStorage.getItem("reservas")) || {};



/*
   Guardamos algunos elementos del HTML en constantes.

   Esto nos permite utilizarlos varias veces sin tener
   que buscarlos nuevamente con document.getElementById().
*/
const horaSelect = document.getElementById("hora");

const profesionalSelect =
    document.getElementById("profesional");

const formCita =
    document.getElementById("form-cita");

const fechaInput =
    document.getElementById("fecha");



/* =====================================================
   EVITAR FECHAS ANTERIORES
   ===================================================== */


/*
   Creamos la fecha actual.
*/
const hoy = new Date();


/*
   Convertimos la fecha al formato:
   año-mes-día

   Ejemplo:
   2026-09-29
*/
const fechaMinima =
    hoy.getFullYear() +
    "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(hoy.getDate()).padStart(2, "0");


/*
   El atributo min evita que el usuario pueda
   seleccionar una fecha anterior a hoy.
*/
fechaInput.min = fechaMinima;



/* =====================================================
   FUNCIÓN PARA GENERAR HORARIOS
   ===================================================== */


function generarHorarios(inicio, fin) {

    /*
       Creamos un arreglo vacío donde guardaremos
       cada una de las horas.
    */
    const lista = [];


    /*
       El ciclo empieza en la hora inicial y aumenta
       de uno en uno.
    */
    for (let hora = inicio; hora < fin; hora++) {

        /*
           Convertimos números como 7 en "07:00".

           padStart agrega un cero al inicio cuando
           el número solamente tiene un dígito.
        */
        const horaFormateada =
            `${hora.toString().padStart(2, "0")}:00`;


        /*
           Guardamos la hora dentro del arreglo.
        */
        lista.push(horaFormateada);
    }


    /*
       Devolvemos todas las horas generadas.
    */
    return lista;
}



/* =====================================================
   CARGAR HORARIOS DISPONIBLES
   ===================================================== */


function cargarHorarios() {

    /*
       Obtenemos la profesional seleccionada.
    */
    const profesional = profesionalSelect.value;


    /*
       Obtenemos también la fecha porque una profesional
       puede tener una cita a la misma hora en días
       diferentes.
    */
    const fecha = fechaInput.value;


    /*
       Limpiamos las opciones anteriores.
    */
    horaSelect.innerHTML = "";


    /*
       Si todavía no hay profesional o fecha,
       mostramos un mensaje.
    */
    if (!profesional || !fecha) {

        const opcion = document.createElement("option");

        opcion.value = "";

        opcion.textContent =
            "Selecciona fecha y profesional";

        horaSelect.appendChild(opcion);

        return;
    }


    /*
       Creamos una clave utilizando la fecha y
       la profesional.

       Ejemplo:
       2026-09-29-alex
    */
    const claveReserva = `${fecha}-${profesional}`;


    /*
       Recorremos todos los horarios.
    */
    horarios.forEach(function (hora) {

        /*
           Revisamos si esta hora ya se encuentra
           guardada para esa fecha y profesional.

           Si todavía no existe esa clave usamos
           un arreglo vacío.
        */
        const horasReservadas =
            reservas[claveReserva] || [];


        const ocupada =
            horasReservadas.includes(hora);


        /*
           Creamos una opción para el select.
        */
        const opcion =
            document.createElement("option");


        opcion.value = hora;

        opcion.textContent = hora;


        /*
           Si la hora está ocupada, no permitimos
           seleccionarla.
        */
        if (ocupada) {

            opcion.disabled = true;

            opcion.textContent =
                `${hora} - No disponible`;
        }


        /*
           Agregamos la opción al select.
        */
        horaSelect.appendChild(opcion);

    });

}



/*
   Cada vez que cambie la profesional,
   actualizamos los horarios.
*/
profesionalSelect.addEventListener(
    "change",
    cargarHorarios
);


/*
   También actualizamos los horarios cuando
   cambie la fecha.
*/
fechaInput.addEventListener(
    "change",
    cargarHorarios
);



/* =====================================================
   ENVIAR RESERVA
   ===================================================== */


formCita.addEventListener("submit", function (evento) {

    /*
       Evitamos que el formulario recargue la página.
    */
    evento.preventDefault();


    /*
       Obtenemos los datos escritos por el usuario.
    */
    const nombre =
        document.getElementById("nombre").value.trim();

    const fecha =
        fechaInput.value;

    const profesional =
        profesionalSelect.value;

    const hora =
        horaSelect.value;

    const telefono =
        document.getElementById("telefono").value.trim();


    /*
       Validación sencilla.

       Aunque HTML ya tiene required, hacemos una
       segunda comprobación desde JavaScript.
    */
    if (
        !nombre ||
        !fecha ||
        !profesional ||
        !hora ||
        !telefono
    ) {

        alert(
            "Por favor completa todos los datos de la reserva."
        );

        return;
    }


    /*
       Creamos nuevamente la clave de la reserva.
    */
    const claveReserva =
        `${fecha}-${profesional}`;


    /*
       Si todavía no existe una lista de reservas
       para esa fecha y profesional, la creamos.
    */
    if (!reservas[claveReserva]) {

        reservas[claveReserva] = [];
    }


    /*
       Verificamos nuevamente que la hora
       no haya sido reservada.
    */
    if (
        reservas[claveReserva].includes(hora)
    ) {

        alert(
            "Lo sentimos, este horario ya está reservado."
        );

        cargarHorarios();

        return;
    }


    /*
       Guardamos la hora reservada.
    */
    reservas[claveReserva].push(hora);


    /*
       Guardamos todas las reservas en localStorage.

       Esto permite conservarlas aunque actualicemos
       la página en este mismo navegador.
    */
    localStorage.setItem(
        "reservas",
        JSON.stringify(reservas)
    );


    /*
       Convertimos el código interno de la profesional
       en su nombre completo.
    */
    let nombreProfesional = "";

    if (profesional === "alex") {

        nombreProfesional =
            "Alexandra Cubillos";

    } else {

        nombreProfesional =
            "Laura Lozano";
    }


    /*
       Mostramos una confirmación sencilla.
    */
    alert(
        `¡Gracias ${nombre}! Tu cita con ${nombreProfesional} fue registrada para el ${fecha} a las ${hora}.`
    );


    /*
       Preparamos el mensaje para WhatsApp.
    */
    const mensaje =
        `Hola, soy ${nombre}. ` +
        `Quiero confirmar mi cita en Libella ` +
        `con ${nombreProfesional}, ` +
        `el día ${fecha} a las ${hora}.`;


    /*
       encodeURIComponent convierte espacios y
       caracteres especiales para que puedan viajar
       correctamente dentro de una URL.
    */
    const mensajeCodificado =
        encodeURIComponent(mensaje);


    /*
       Número de contacto de Libella.

       Utilizamos el indicativo 57 correspondiente
       a Colombia.
    */
    const telefonoLibella =
        "573017501031";


    /*
       Abrimos WhatsApp en una nueva pestaña.
    */
    window.open(
        `https://wa.me/${telefonoLibella}?text=${mensajeCodificado}`,
        "_blank"
    );


    /*
       Limpiamos el formulario.
    */
    formCita.reset();


    /*
       Dejamos nuevamente el mensaje inicial
       en el selector de horas.
    */
    horaSelect.innerHTML =
        '<option value="">Primero selecciona una profesional</option>';

});



/* =====================================================
   OPINIONES
   ===================================================== */


const formOpinion =
    document.getElementById("form-opinion");

const listaOpiniones =
    document.getElementById("lista-opiniones");



/*
   Cuando el HTML termina de cargar,
   buscamos las opiniones guardadas.
*/
document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Recuperamos las opiniones.

           Si no existen usamos un arreglo vacío.
        */
        const opinionesGuardadas =
            JSON.parse(
                localStorage.getItem("opiniones")
            ) || [];


        /*
           Recorremos cada opinión y la mostramos.
        */
        opinionesGuardadas.forEach(
            function (opinion) {

                mostrarOpinion(
                    opinion.usuario,
                    opinion.comentario
                );

            }
        );

    }
);



/* =====================================================
   MOSTRAR UNA OPINIÓN
   ===================================================== */


function mostrarOpinion(usuario, comentario) {

    /*
       Creamos el contenedor de la opinión.
    */
    const opinionDiv =
        document.createElement("div");


    opinionDiv.className = "opinion";


    /*
       Creamos un elemento strong para mostrar
       el nombre de la persona.
    */
    const nombreUsuario =
        document.createElement("strong");


    /*
       Utilizamos textContent porque solamente
       necesitamos mostrar texto.
    */
    nombreUsuario.textContent = usuario;


    /*
       Creamos un párrafo para el comentario.
    */
    const textoComentario =
        document.createElement("p");


    textoComentario.textContent = comentario;


    /*
       Agregamos el nombre y comentario
       dentro del contenedor.
    */
    opinionDiv.appendChild(nombreUsuario);

    opinionDiv.appendChild(textoComentario);


    /*
       Finalmente agregamos la opinión
       a la página.
    */
    listaOpiniones.appendChild(opinionDiv);

}



/* =====================================================
   GUARDAR UNA NUEVA OPINIÓN
   ===================================================== */


formOpinion.addEventListener(
    "submit",
    function (evento) {

        /*
           Evitamos que la página se recargue.
        */
        evento.preventDefault();


        /*
           Obtenemos los datos escritos.
        */
        const usuario =
            document.getElementById("usuario")
                .value
                .trim();


        const comentario =
            document.getElementById("comentario")
                .value
                .trim();


        /*
           Comprobamos que los campos tengan contenido.
        */
        if (!usuario || !comentario) {

            alert(
                "Por favor escribe tu nombre y tu opinión."
            );

            return;
        }


        /*
           Mostramos la nueva opinión.
        */
        mostrarOpinion(
            usuario,
            comentario
        );


        /*
           Recuperamos las opiniones anteriores.
        */
        const opiniones =
            JSON.parse(
                localStorage.getItem("opiniones")
            ) || [];


        /*
           Agregamos la nueva opinión.
        */
        opiniones.push({
            usuario: usuario,
            comentario: comentario
        });


        /*
           Guardamos nuevamente el arreglo completo.
        */
        localStorage.setItem(
            "opiniones",
            JSON.stringify(opiniones)
        );


        /*
           Limpiamos el formulario.
        */
        formOpinion.reset();

    }
);