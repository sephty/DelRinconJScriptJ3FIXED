import { API_BASE_URL } from '../../../config.js';

const API_URL = `${API_BASE_URL}/habitaciones`;

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