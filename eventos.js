//Guardo mi ruta de eventos en una constante:

const API = "http://localhost:3000/eventos";

// Creo la función para crear un evento.
// Utilizo "export" para reutilizar esta función en otros archivos.
// Gestiono la promesa de Fetch haciendo uso del matrimonio de "async-await".

export async function crearEvento(evento) {
  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(evento),
  });
  return res.ok;
}

//Funcion para obtener los eventos:

export async function obtenerEventos() {
  const res = await fetch(API);
  return await res.json();
}

//Funcion para editar un evento:

export async function editarEvento(id, evento) {
  return await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(evento),
  });
}

//Funcion para eliminar un evento:

export async function eliminarEvento(id) {
  return await fetch(`${API}/${id}`, {
    method: "DELETE"
  });
}

// Funcion para registrar la asistencia

export async function registrarAsistente(eventoId, usuarioId) {
  const resEvento = await fetch(`http://localhost:3000/eventos/${eventoId}`);
  const evento = await resEvento.json();

  const resRegistros = await fetch(`http://localhost:3000/registros?eventoId=${eventoId}`);
  const registros = await resRegistros.json();

  if (registros.length < evento.capacidad) {
    await fetch(`http://localhost:3000/registros`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({eventoId, usuarioId})
    });
    return true;
  }
  return false;
}
