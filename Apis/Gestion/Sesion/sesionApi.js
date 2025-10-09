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

export const iniciarSesion = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}?username=${username}&password=${password}`);
        if (!response.ok) {
            throw new Error('Error en la solicitud de inicio de sesión.');
        }
        const usuarios = await response.json();
        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            sessionStorage.setItem('usuarioId', usuario.id);
            return usuario;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error en iniciarSesion:', error);
    }
};

export const cerrarSesion = () => {
    sessionStorage.removeItem('usuarioId');
};

export const getUsuarioIdActual = () => {
    return sessionStorage.getItem('usuarioId');
};

export const haySesionActiva = () => {
    return sessionStorage.getItem('usuarioId') !== null;
};