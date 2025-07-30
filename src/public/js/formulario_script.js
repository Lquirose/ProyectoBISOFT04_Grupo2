//Se declara e inicializa la constante mensajeError
const mensajesError = { 
  "routeName": "Debe tener entre 3 y 60 letras. Ej: San Rafael - Alajuela.",
  "transportTime": "Seleccione una hora válida. Ej: 05:00 a 22:00.",
  "transportDestination": "Solo letras y espacios. Mínimo 3 caracteres.",
  "transportFrecuency": "Debe estar entre 5 y 240 minutos.",
  "transportFee": "Ingrese una tarifa positiva en colones.",
  "tripDuration": "Duración entre 10 minutos y 3 horas.",
  "email": "Ingresá un email válido. Ej: alguien@mail.",
  "password": "La clave debe tener al menos seis dígitos.",
  "confirmPassword": "Las contraseñas no coinciden.",
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
const validadores = {
  "routeName": (value) => /^[a-zA-ZÀ-ÿ\s\-]{3,60}$/.test(value),
  "transportDestination": (value) => /^[a-zA-ZÀ-ÿ\s\-]{3,60}$/.test(value),
  "transportTime": (value) => {
    if (!value) return false;
    const [hh, mm] = value.split(":").map(Number);
    const minutos = hh * 60 + mm;
    return minutos >= 300 && minutos <= 1320; // entre 05:00 y 22:00
  },
  "transportFrecuency": (value) => {
    const num = Number(value);
    return num >= 5 && num <= 240;
  },
  "transportFee": (value) => Number(value) > 0,
  "tripDuration": (value) => {
    if (!value) return false;
    const [hh, mm] = value.split(":").map(Number);
    const minutos = hh * 60 + mm;
    return minutos >= 10 && minutos <= 180;
  },
  "usuario": (value) => /^[a-zA-Z0-9\_\-]{4,16}$/.test(value),
  "email": (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  "password": (value) => value.length >= 6,
  "confirmPassword": (value) => {
    const password = document.querySelector('input[name="password"]').value;
    return value === password && value.length >= 6;
  },
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
  const nombre = input.name;
  const valor = input.value;
  const esValido = validadores[nombre]?.(valor);

  const grupo = input.closest(".form-group");
  const mensaje = grupo.querySelector(".form-message-error");

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

//Validación en tiempo real, con paso 4 integrado
const inputs = document.querySelectorAll("#form input, #form textarea");

inputs.forEach((input) => {
  input.addEventListener("keyup", () => {
    validarCampo(input);
    if (input.name === "password" || input.name === "confirmPassword") {
      const confirmInput = document.querySelector('input[name="confirmPassword"]');
      if (confirmInput) validarCampo(confirmInput);
    }
  });
  input.addEventListener("blur", () => {
    validarCampo(input);
    if (input.name === "password" || input.name === "confirmPassword") {
      const confirmInput = document.querySelector('input[name="confirmPassword"]');
      if (confirmInput) validarCampo(confirmInput);
    }
  });
});

//Validación al enviar el formulario
document.getElementById("form").addEventListener("submit", (e) => {
  let formularioValido = true;

  inputs.forEach((input) => {
    const valido = validadores[input.name]?.(input.value);
    if (!valido) {
      validarCampo(input);
      formularioValido = false;
    }
  });

  if (!formularioValido) {
    e.preventDefault();
    alert("Por favor corregí los campos marcados antes de guardar.");
  }
});
