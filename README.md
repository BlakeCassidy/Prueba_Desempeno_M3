
# SPA Gestión de Eventos

Esta es una Single Page Application (SPA) desarrollada con JavaScript puro, HTML y CSS. Su objetivo es permitir la **gestión de eventos** para diferentes tipos de usuarios: **administradores** y **visitantes**.


## Requisitos

- Tener **Node.js** instalado
- Tener instalado **json-server** (servidor falso para simular una base de datos)

## Instalación

¿Cómo instalar y ejecutar el proyecto?

1. Descarga o clona este repositorio

2. Abre una terminal dentro de la carpeta del proyecto.

3. Instala json-server localmente:

npm install json-server --save-dev

4. Inicia el servidor de la base de datos.

npx json-server --watch db.json

5. Abre el archivo index.html en tu navegador

## Información

Usuarios:

- Usuario administrador por defecto

Correo: admin@admin.com

Contraseña: admin123

Rol: administrador

- Usuarios visitantes:

Los visitantes pueden registrarse libremente. Pueden ver e inscribirse en eventos .


## Funcionalidades

Visitantes:

- Registrarse e iniciar sesión.

- Ver la lista de eventos.

- Inscribirse en eventos.

Administradores:

- Crear eventos.

- Editar eventos.

- Eliminar eventos.

Otras:

- La sesión del usuario se guarda en localStorage y se mantiene aunque recargues la página.

- Si intentas acceder a páginas protegidas sin estar autenticado, serás redirigido.

- json-server simula la base de datos pero no tiene autenticación real, es solo para pruebas.

## Estructura del proyecto

- index.html : Página principal

- style.css: Estilos básicos de la SPA

- main.js : Lógica central, control de vistas y sesión

- auth.js : Registro, login y persistencia de sesión

- eventos.js : Funciones CRUD para eventos y registros

- db.json : Base de datos simulada con json-server

- README.md	: Este archivo con instrucciones




npm install json-server
npx json-server --watch db.json --port 3000

