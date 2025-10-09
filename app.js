import './App/Components/menu/habitationCard.js';
import { getHabitaciones } from './Apis/Gestion/habitaciones/habitacionesApi.js';
import { haySesionActiva, cerrarSesion } from './Apis/Gestion/Sesion/sesionApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    
    if (haySesionActiva()) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
        window.location.reload();
    });

    const roomsGridContainer = document.getElementById('rooms-grid-container');
    if (roomsGridContainer) {
        getHabitaciones().then(habitaciones => {
            if (habitaciones && habitaciones.length > 0) {
                roomsGridContainer.innerHTML = '';
                habitaciones.slice(0, 6).forEach(habitacion => {
                    const card = document.createElement('habitacion-card');
                    card.habitacion = habitacion;
                    roomsGridContainer.appendChild(card);
                });
            }
        });
    }
});