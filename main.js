//Importo las funciones (herramientas) de mis otros archivos para reutilizarlas en este.

import { login, registrarUsuario, obtenerUsuarioActual, cerrarSesion } from './auth.js';
import { obtenerEventos, crearEvento, editarEvento, eliminarEvento,registrarAsistente } from './eventos.js';

//Atrapo el "div" de mi index.html

const app = document.getElementById('app')

// Guardo el usuario obtenido en una variable

const usuario = obtenerUsuarioActual();

// Funcion para pintar el formulario de ingreso:

function renderLogin(){

  app.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <form id="form-login">
      <input type="email" placeholder="Correo" required id="correo" />
      <input type="password" placeholder="Contraseña" required id="contraseña" />
      <button type="submit">Entrar</button>
    </form>
    <p>¿No tienes cuenta? <a href="#" id="go-register">Regístrate</a></p>
  `;

// Capturo el evento de cuando se presiona el boton "Entrar" (submit) del formulario:
// Evito cargas automaticas con el uso de "preventDefault"

  document.getElementById('form-login').addEventListener('submit', async e => {
    e.preventDefault();
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    //Comienzo a pasarle parametros a la función de "login",
    //con los valores provenientes de los inputs del formulario

    const user = await login(correo, contraseña);
    if (user) location.reload();
    else alert("Credenciales incorrectas");
  });

// Capturo el evento de cuando se hace click en el ancla para ir a registrarse
// Comienza la ejecución de dicha función.
  document.getElementById('go-register').addEventListener('click', () => renderRegister());
}

// Función para registrarse (Pintar formulario de ingreso):

function renderRegister() {
  app.innerHTML = `
    <h2>Registro</h2>
    <form id="form-register">
      <input type="text" placeholder="Nombre" required id="nombre" />
      <input type="email" placeholder="Correo" required id="correo" />
      <input type="password" placeholder="Contraseña" required id="contraseña" />
      <select id="rol">
        <option value="visitante">Visitante</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
    <p>¿Ya tienes cuenta? <a href="#" id="go-login">Inicia Sesión</a></p>
  `;

// Capturo el evento de cuando se presiona el boton "Registrarse" (submit) del formulario:

  document.getElementById('form-register').addEventListener('submit', async e => {
    e.preventDefault();

    // Creo un objeto cuyas claves seran las mismas claves de mi db.json y 
    // sus valores,serán los escritos en los inputs del formulario.

    const nuevoUsuario = {
      nombre: document.getElementById('nombre').value,
      correo: document.getElementById('correo').value,
      contraseña: document.getElementById('contraseña').value,
      rol: document.getElementById('rol').value
    };

    // Creo una constante para comenzar a utilizar la función de registrar usuario y
    // verificar si se registró o hubo un error.

    const ok = await registrarUsuario(nuevoUsuario);
    if (ok) {
      alert("Registrado con éxito. Ahora inicia sesión.");
      renderLogin();
    } else {
      alert("Hubo un error al registrar");
    }
  });

  // Capturo el evento de cuando se hace click en el ancla para ir a iniciar sesión.
  // Comienza la ejecución de dicha función.
  document.getElementById('go-login').addEventListener('click', () => renderLogin());
}

// Funcion para mostrar la información de los eventos (Tablero)

function renderDashboard() {
  app.innerHTML = `
    <h2>Bienvenido, ${usuario.nombre}</h2>
    <button id="cerrar-sesion">Cerrar Sesión</button>
    <h3>Eventos</h3>
    <div id="lista-eventos"></div>
    ${usuario.rol === 'admin' ? `
      <h4>Crear evento</h4>
      <form id="form-crear">
        <input type="text" id="titulo" placeholder="Título" required/>
        <input type="number" id="capacidad" placeholder="Capacidad" required/>
        <button type="submit">Crear</button>
      </form>` : ''
    }
  `;

  //Capturo el evento para cuando se da click el boton de cerrar la sesión.
  // Inmediatamente, se ejecuta la funcion para cerrarla.
  document.getElementById('cerrar-sesion').addEventListener('click', () => {
    cerrarSesion();
    location.reload();
  });

  // Confirmo si el usuario tiene el rol de admin
  // Capturo el evento de submit para cuando se presiona el boton de "crear" en el formulario de eventos.
  if (usuario.rol === 'admin') {
    document.getElementById('form-crear').addEventListener('submit', async e => {
      e.preventDefault();

    // Creo un objeto cuyas claves seran las mismas claves de mi db.json y 
    // sus valores,serán los escritos en los inputs del formulario.

      const evento = {
        titulo: document.getElementById('titulo').value,
        capacidad: parseInt(document.getElementById('capacidad').value),
      };

    // Paso el objeto como parametro a la función que crea los eventos.
      await crearEvento(evento);
      renderDashboard();
    });
  }

  //Muestro los eventos.
  cargarEventos();
}

//Funcion para cargar los eventos
async function cargarEventos() {

  //Ejecuto la función para obtener la data de los eventos
  const eventos = await obtenerEventos();
  const contenedor = document.getElementById('lista-eventos');
  contenedor.innerHTML = "";

  //Recorro cada uno de ellos para despues pintarlos en la pagina
  
  eventos.forEach(ev => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${ev.titulo}</strong> - Capacidad: ${ev.capacidad}</p>
      ${usuario.rol === 'admin'
        ? `<button onclick="editar(${ev.id})">Editar</button>
           <button onclick="borrar(${ev.id})">Eliminar</button>`
        : `<button onclick="inscribirse(${ev.id})">Registrarme</button>`
      }
    `;
    contenedor.appendChild(div);
  });
}

window.editar = async function (id) {
  const nuevoTitulo = prompt("Nuevo título:");
  const nuevaCapacidad = parseInt(prompt("Nueva capacidad:"));
  await editarEvento(id, { titulo: nuevoTitulo, capacidad: nuevaCapacidad });
  renderDashboard();
};

window.borrar = async function (id) {
  await eliminarEvento(id);
  renderDashboard();
};

window.inscribirse = async function (id) {
  console.log("Intentando registrarse en el evento:", id);
  if (!usuario) {
    alert("Debes iniciar sesión para registrarte.");
    return;
  }
  const exito = await registrarAsistente(id, usuario.id);
  alert(exito ? "Registrado con éxito" : "El evento está lleno");
};

if (!usuario) {
  renderLogin();
} else {
  renderDashboard();
}

