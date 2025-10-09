import './App/Components/gestion/habitacionReg.js';
import { getHabitaciones } from './Apis/Gestion/habitaciones/habitacionesApi.js';
import { getReservas } from './Apis/Gestion/reserva/reservaApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const grid = document.getElementById('habitaciones-grid');
    let allHabitaciones = [];

    const loadData = async () => {
        const habitaciones = await getHabitaciones() || [];
        const reservas = await getReservas() || [];
        const reservedIds = new Set(reservas.map(r => r.habitacionId));

        allHabitaciones = habitaciones.map(hab => ({
            ...hab,
            isReserved: reservedIds.has(hab.id)
        }));
        
        renderGrid();
    };
    
    const renderGrid = () => {
        const searchTerm = searchInput.value.toLowerCase();
        grid.innerHTML = '';

        const filtered = allHabitacinones.filter(hab => 
            hab.tipo.toLowerCase().includes(searchTerm)
        );

        if (filtered.length === 0) {
            grid.innerHTML = `<p class="no-results">No se encontraron habitaciones.</p>`;
        } else {
            filtered.forEach(hab => {
                const card = document.createElement('habitacion-reg');
                card.habitacion = hab;
                grid.appendChild(card);
            });
        }
    };

    searchInput.addEventListener('input', renderGrid);

    loadData();
});

