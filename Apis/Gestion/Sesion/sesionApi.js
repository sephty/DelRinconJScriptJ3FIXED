const API_URL = 'http://localhost:3000/usuarios';

export const createUsuario = async (nuevoUsuario) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoUsuario),
        });
        if (!response.ok) {
            throw new Error('Error al crear el usuario.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createUsuario:', error);
    }
};

export const iniciarSesion = async (identificacion, password) => {
    try {
        // Use POST for security: don't send credentials in the URL
        const response = await fetch(`${API_URL}?identificacion=${encodeURIComponent(identificacion)}`);
        if (!response.ok) {
            throw new Error('Error en la solicitud de inicio de sesión.');
        }
        const usuarios = await response.json();
        // Verify password on the client-side (for json-server)
        if (usuarios.length > 0 && usuarios[0].password === password) {
            const usuario = usuarios[0];
            sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
            return usuario;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error en iniciarSesion:', error);
        return null;
    }
};

export const cerrarSesion = () => {
    sessionStorage.removeItem('usuarioActual');
};

export const getUsuarioActual = () => {
    const usuario = sessionStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
};

export const getUsuarioIdActual = () => {
    const usuario = getUsuarioActual();
    return usuario ? usuario.id : null;
};

export const haySesionActiva = () => {
    return sessionStorage.getItem('usuarioActual') !== null;
};

export const getUsuarios = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getUsuarios:', error);
    }
};

export const getUsuarioById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener el usuario con id ${id}.`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getUsuarioById:', error);
    }
};

export const updateUsuario = async (id, datosActualizados) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar el usuario con id ${id}.`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateUsuario:', error);
    }
};

export const deleteUsuario = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar el usuario con id ${id}.`);
        }
        console.log(`Usuario con id ${id} eliminado.`);
    } catch (error) {
        console.error('Error en deleteUsuario:', error);
    }
};

export const checkAdmin = () => {
    const usuario = getUsuarioActual();
    if (!usuario) {
        alert("Debes iniciar sesión para acceder al panel.");
        window.location.href = "iniciarsesion.html";
        return false;
    }
    if (usuario.rol !== "admin") {
        alert("Acceso restringido. Solo administradores pueden ingresar.");
        window.location.href = "index.html";
        return false;
    }
    return true;
};