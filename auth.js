//Guardo mi ruta de usuarios en una constante.

const API = "http://localhost:3000/usuarios";

// Creo la función para registrar el usuario.
// Utilizo "export" para reutilizar esta función en otros archivos.
// Gestiono la promesa de Fetch haciendo uso del matrimonio de "async-await".

export async function registrarUsuario(usuario) {
  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(usuario),
  });
  return res.ok;
}

// Función para el proceso de login.

export async function login(correo, contraseña) {
  const res = await fetch(`${API}?correo=${correo}&contraseña=${contraseña}`);
  const datos = await res.json();
  if (datos.length > 0) {
    localStorage.setItem("usuario", JSON.stringify(datos[0]));
    return datos[0];
  }
  return null;
}

// Función para obtener el usuario actual en LocalStorage:
export function obtenerUsuarioActual() {
  return JSON.parse(localStorage.getItem("usuario"));
}

// Función para cerrar sesión (remover del Local Storage):
export function cerrarSesion() {
  localStorage.removeItem("usuario");
}


