 
 const API_URL = 'http://localhost:3000/reservas';

export const getReservas = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener las reservas.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getReservas:', error);
    }
};

export const createReserva = async (nuevaReserva) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaReserva),
        });
        if (!response.ok) {
            throw new Error('Error al crear la reserva.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createReserva:', error);
    }
};

export const updateReserva = async (id, datosActualizados) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar la reserva con id ${id}.`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateReserva:', error);
    }
};

export const deleteReserva = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar la reserva con id ${id}.`);
        }
        console.log(`Reserva con id ${id} eliminada.`);
    } catch (error) {
        console.error('Error en deleteReserva:', error);
    }
};