//Se declara e inicializa la constante mensajeError
const mensajesError = { //Esto es un objeto literal, sirve para almacena los mensajes de error. Está dividido en clave y valor, siendo por ejemplo route-name una clave y lo que está después de los dos puntos un valor. Vease como un diccionario de mensajes de error-
  "routeName": "Debe tener entre 3 y 60 letras. Ej: San Rafael - Alajuela.",
  "transportTime": "Seleccione una hora válida. Ej: 05:00 a 22:00.",
  "transportDestination": "Solo letras y espacios. Mínimo 3 caracteres.",
  "transportFrecuency": "Debe estar entre 5 y 240 minutos.",
  "transportFee": "Ingrese una tarifa positiva en colones.",
  "tripDuration": "Duración entre 10 minutos y 3 horas.",
  "email": "Ingresá un email válido. Ej: alguien@mail.",
  "password": "La clave debe tener al menos seis dígitos.",
  "usuario": " 4 - 16 caracteres: letras A-a, números, _ o -",
  "reportTitle": "Debe de tener entre 10 y 60 letras",
  "reportDescription": "Debe de tener entre 10 y 150 letras",
  "communityLocation": "Debe de tener entre 10 y 60 letras",
  "businessName": "Debe de tener entre 10 y 60 letras",
  "businessDescription": "Debe tener de 10 a 250 letras",
  "businessTelephone":"Debe de tener nueve números y empezar con 8,9 o 7",
  "businessLocation":"Debe tener de 10 a 150 letras",

}
//Validadores
const validadores = {// Se declara e inicializa la varable validadores
  "routeName": (value) => /^[a-zA-ZÀ-ÿ\s\-]{3,60}$/.test(value),//Expresiones regulares
  "transportDestination": (value) => /^[a-zA-ZÀ-ÿ\s\-]{3,60}$/.test(value),
  "transportTime": (value) => {
    if (!value) return false;//Retorna error si el usuario deja la casilla en blanco.
    const [hh, mm] = value.split(":").map(Number);// crea el formato de hora ":"
    const minutos = hh * 60 + mm;//Convierte el numero de horas a minutos
    return minutos >= 300 && minutos <= 1320; // entre 05:00 y 22:00
  },
  "transportFrecuency": (value) => {
    const num = Number(value);//Hace que el valor que viene como string se convierta a entero
    return num >= 5 && num <= 240; //El número debe de ser mayor a 5 y menor a 240
  },
  "transportFee": (value) => Number(value) > 0, //Igual que transport-time
  "tripDuration": (value) => {
    if (!value) return false;
    const [hh, mm] = value.split(":").map(Number);
    const minutos = hh * 60 + mm;
    return minutos >= 10 && minutos <= 180;
  },
  "usuario": (value)=>/^[a-zA-Z0-9\_\-]{4,16}$/.test(value),
  "email": (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  "password": (value) => value.length >= 6,
  "reportTitle": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,60}$/.test(value), 
  "reportDescription": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,150}$/.test(value),
  "communityLocation": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,60}$/.test(value),
  "businessName": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,60}$/.test(value),
  "businessDescription": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,250}$/.test(value),
  "businessTelephone": (value) => /^[678]\d{7}$/.test(value),
  "businessLocation": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,150}$/.test(value)


}

//Función para validar inputs 
function validarCampo(input) {
  const nombre = input.name;                  //  El nombre del input (ej. "route-name")
  const valor = input.value;                  //  Lo que escribió el usuario
  const esValido = validadores[nombre]?.(valor);  //  Ejecutamos el validador para ese campo

  

  const grupo = input.closest(".form-group"); // Contenedor visual del campo
  const mensaje = grupo.querySelector(".form-message-error");  //  Mensaje de error

  if (esValido) {
    grupo.classList.add("formgroup-correct");
    grupo.classList.remove("form-group-incorrect");
    mensaje.classList.remove("formerror-active");
    
  } else { 
    grupo.classList.add("form-group-incorrect");
    grupo.classList.remove("formgroup-correct");
    mensaje.textContent = mensajesError[nombre] || "Campo inválido";
    mensaje.classList.add("formerror-active");
    
  }
}

//Validación en tiempo real. Se escuchan eventos (cuando el usuario se posiciona en el input y cuando esta fuera del input) y se llama a la función de validar campo para que se muestre el css correcto
const inputs = document.querySelectorAll("#form input, #form textarea");

inputs.forEach((input) => {
  input.addEventListener("keyup", () => validarCampo(input)); // se dispara cuando el usuario escribe
  input.addEventListener("blur", () => validarCampo(input));  // se dispara cuando el usuario sale del campo
});

//
document.getElementById("form").addEventListener("submit", (e) => {//Busca todos los id que se llamen form y cuando se le de submit se envie.
  let formularioValido = true; //BOOLEANO que nos dice si todo es correcto, al principio se le asigna el valor de true.

  inputs.forEach((input) => { //Busca todos los inputs
    const valido = validadores[input.name]?.(input.value);//Busca los nombres por el input y ejecuta los validadores para inspeccionar los valores que escribio el usuario
    if (!valido) { //Si el dato está mal
      validarCampo(input); // Forzamos la validación visual
      formularioValido = false;
    }
  });

  if (!formularioValido) {//Si el formulario no es valido
    e.preventDefault(); // Cancela el envío
    alert("Por favor corregí los campos marcados antes de guardar.");
  }
});