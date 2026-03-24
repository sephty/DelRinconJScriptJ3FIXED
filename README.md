# 🏨 Hotel Rincón del Carmen

Un proyecto personal donde se desarrolla un sistema básico de gestión de reservas para un hotel, con enfoque en **simplicidad**, **modularidad** y **responsividad**.  
Hecho completamente en **vanilla JavaScript**, usando **JSON Server** como API local para simular una base de datos real.

## 🚀 Ejecución del Proyecto

Para levantar y probar el sistema de Hotel Rincón del Carmen, sigue estos pasos:

Clonar el repositorio o descargar los archivos del proyecto.

```
git clone <URL-del-repositorio>
cd hotel-rincon-del-carmen
```


Instalar JSON Server (si no lo tienes instalado globalmente):

```
npm install -g json-server
```

Iniciar la API local para simular la base de datos:

```
json-server --watch db.json --port 3000
```

Abrir la aplicación en tu navegador:
index.html → Interfaz pública para los clientes
gestion.html → Panel de administración
Probar funcionalidades:
Registro e inicio de sesión de usuarios
Crear, listar y cancelar reservas
Gestionar habitaciones desde el panel de administración

⚠️ Asegúrate de que JSON Server esté corriendo antes de interactuar con cualquier funcionalidad que requiera datos persistentes.

---

## 📖 Descripción Personal

Este proyecto nació como una forma de practicar la estructura completa de una aplicación web:  
desde la **interfaz pública para los clientes**, hasta el **panel de administración** para el hotel.  

Mi objetivo fue crear algo funcional, bien organizado y fácil de mantener, aplicando buenas prácticas de desarrollo sin depender de frameworks grandes.

Cuenta con:
- Registro e inicio de sesión de usuarios.
- Sistema de reservas persistentes (guardadas en `db.json`).
- Panel de administración para gestionar habitaciones y usuarios.
- Listado de reservas con opción de cancelarlas.
- Interfaz totalmente adaptable (responsive).

---

## ⚙️ Estructura del Proyecto

/hotel-rincon-del-carmen
│
├── index.html # Página principal
├── gestion.html # Panel del administrador
├── reservas.html # Vista de reservas del usuario
├── confirmacion.html # Página de confirmación
│
├── js/
│ ├── app.js # Inicialización principal
│ ├── usuarios.js # Manejo de login/registro
│ ├── habitaciones.js # Gestión de habitaciones
│ ├── reservas.js # Creación y cancelación de reservas
│ └── api/
│ └── usuariosModel.js # Conexión con JSON Server
│
├── css/
│ ├── shared.css # Estilos globales (body, header, footer)
│ ├── indexComponent.css # Estilos de la página principal
│ ├── gestion.css # Estilos del panel admin
│ └── reservas.css # Estilos de reservas de usuario
│
└── db.json # Base de datos local

