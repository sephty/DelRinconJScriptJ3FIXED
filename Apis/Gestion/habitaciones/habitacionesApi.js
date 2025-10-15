const API_URL = 'http://localhost:3000/habitaciones';

export const getHabitaciones = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener las habitaciones.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getHabitaciones:', error);
    }
};

export const getHabitacionById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener la habitación con id ${id}.`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getHabitacionById:', error);
    }
};

export const createHabitacion = async (nuevaHabitacion) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaHabitacion),
        });
        if (!response.ok) {
            throw new Error('Error al crear la habitación.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createHabitacion:', error);
    }
}

export const updateHabitacion = async (id, datosActualizados) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar la habitación con id ${id}.`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateHabitacion:', error);
    }
}

export const deleteHabitacion = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar la habitación con id ${id}.`);
        }
        console.log(`Habitación con id ${id} eliminada.`);
    } catch (error) {
        console.error('Error en deleteHabitacion:', error);
    }
}

export const reservaActual = async 