
import '../gestion/habitacionreg.js';
import { getHabitaciones } from '../../../Apis/Gestion/habitaciones/habitacionesApi.js';
import { getReservas } from '../../../Apis/Gestion/reserva/reservaApi.js';

import { haySesionActiva, cerrarSesion, getUsuarioActual } from '../../../Apis/Gestion/Sesion/sesionApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('search-input');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const dateSearchBtn = document.getElementById('date-search-btn');
    const grid = document.getElementById('habitaciones-grid');
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    let allHabitaciones = [];

    if (haySesionActiva()) {
        const usuario = getUsuarioActual();
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = usuario.nombreCompleto;
        logoutBtn.addEventListener('click', () => {
            cerrarSesion();
            window.location.reload();
        });
    }

    const loadData = async () => {
        const habitaciones = await getHabitaciones() || [];
        const reservas = await getReservas() || [];
        const reservedIds = new Set(reservas.map(r => r.habitacionId));

        allHabitaciones = habitaciones.map(hab => ({
            ...hab,
            isReserved: reservedIds.has(parseInt(hab.id))
        }));
        
        renderGrid();
    };
    
    const renderGrid = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const fromDate = dateFromInput.value;
        const toDate = dateToInput.value;

        grid.innerHTML = '';

        let filtered = allHabitaciones.filter(hab => 
            hab.tipo.toLowerCase().includes(searchTerm)
        );

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);

            filtered = filtered.filter(hab => {
                return hab.disponibilidad.some(disp => {
                    const availFrom = new Date(disp.desde);
                    const availTo = new Date(disp.hasta);
                    return from < availTo && to > availFrom;
                });
            });
        }

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
    dateSearchBtn.addEventListener('click', renderGrid);

    // Load data for all users, regardless of session status
    loadData();
});
