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
  "businessTelephone":"Debe de tener ocho números y empezar con 8,9 o 7",
  "businessLocation":"Debe tener de 10 a 150 letras",
  "category": "Seleccioná una categoría antes de enviar.",
  "image": "Subí una imagen en formato JPG o PNG.",
  "loginDate": "La fecha de registro no puede estar vacía ni ser futura.",
  "telefono": "Debe de tener ocho números y empezar con 8,9 o 7",
  "Identification" : "Debe ingresar una identificación válida de 9 dígitos sin espacios ni símbolos.",
  "nombre": "Debe de tener de 10 a 60 letras",
  "Fecha" : "Debe de tener al menos 15 años para ingresar al sitio",
  "confirmPassword" : "Las contraseñas no coinciden"


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
  "businessLocation": (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,150}$/.test(value),
  "category": (value) => typeof value === "string" && value.trim().length > 0,
  // CORREGIDO: Validador de imagen más flexible
  "image": (value, input) => {
    if (!input || !input.files || input.files.length === 0) return false;
    const file = input.files[0];
    const validFormat = /\.(jpg|jpeg|png)$/i.test(file.name);
    const validSize = file.size <= 5 * 1024 * 1024;
    return validFormat && validSize;
  },
  "loginDate": (value) => {
    if (!value) return false; // Campo vacío
    const fechaIngresada = new Date(value);
    const hoy = new Date();

    // Normalizar fechas para comparar solo año, mes y día
    fechaIngresada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    return fechaIngresada <= hoy; // No permitir fechas futuras
  },
  "Fecha": (value) => {
  if (!value) return false; // campo vacío

  const fechaIngresada = new Date(value);
  const hoy = new Date();
  const edadMinima = 15;

  const fechaLimite = new Date(
    hoy.getFullYear() - edadMinima,
    hoy.getMonth(),
    hoy.getDate()
  );

  return fechaIngresada <= fechaLimite;
}, 
"telefono" : (value) => /^[678]\d{7}$/.test(value),
"nombre" : (value) => /^[a-zA-ZÀ-ÿ\s\-]{10,60}$/.test(value),
"Identification" : (value) => /^\d{9}$/.test(value),
"confirmPassword": (value, input) => {
    // Buscar el campo de contraseña original en el mismo formulario
    const form = input.closest("form");
    const passwordField = form ? form.querySelector('input[name="password"]') : null;
    
    // Si no encuentra el campo password, retorna false
    if (!passwordField) return false;
    
    // Compara que ambas contraseñas coincidan y no estén vacías
    return value.length > 0 && value === passwordField.value;
  }
  


}

//Función para validar inputs 
function validarCampo(input) {
  const nombre = input.name;                  //  El nombre del input (ej. "route-name")
  const valor = input.value;                  //  Lo que escribió el usuario
  const esValido = validadores[nombre]?.(valor, input);  //  Ejecutamos el validador para ese campo

  const grupo = input.closest(".form-group"); // Contenedor visual del campo
  
  // CORREGIDO: Verificar que existe el grupo antes de continuar
  if (!grupo) return;
  
  const mensaje = grupo.querySelector(".form-message-error");  //  Mensaje de error

  // CORREGIDO: Verificar que existe el mensaje antes de continuar
  if (!mensaje) return;

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

document.addEventListener("DOMContentLoaded", () => {
  const loginDateInput = document.getElementById("loginDate");
  if (loginDateInput) {
    // CORREGIDO: Usar fecha local en lugar de UTC
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11
    const dia = String(hoy.getDate()).padStart(2, '0');
    loginDateInput.value = `${año}-${mes}-${dia}`;
  }
});

//Validación en tiempo real. Se escuchan eventos (cuando el usuario se posiciona en el input y cuando esta fuera del input) y se llama a la función de validar campo para que se muestre el css correcto
document.querySelectorAll("form").forEach((formulario) => {
  const campos = formulario.querySelectorAll("input, textarea");

  // CORREGIDO: Validación en tiempo real mejorada
  campos.forEach((input) => {
    // Para campos de archivo, agregar evento change
    if (input.type === "file") {
      input.addEventListener("change", () => validarCampo(input));
    } else {
      // Para otros campos, mantener keyup y blur
      input.addEventListener("keyup", () => validarCampo(input));
      input.addEventListener("blur", () => validarCampo(input));
      // AGREGADO: También validar en input para mejor experiencia
      input.addEventListener("input", () => validarCampo(input));
    }
  });

  // CORREGIDO: Validación al enviar mejorada
  formulario.addEventListener("submit", (e) => {
    let formularioValido = true;

    campos.forEach((input) => {
      // Solo validar campos que tienen validador definido
      if (validadores[input.name]) {
        let valor = input.value;
        if (input.type === "file") {
          valor = ""; // Para que el validador reciba solo el input
        }
        const valido = validadores[input.name]?.(valor, input);
        if (!valido) {
          validarCampo(input);
          formularioValido = false;
        }
      }
    });

    if (!formularioValido) {
      e.preventDefault();
      alert("Por favor corregí los campos marcados antes de guardar.");
    }
  });
});