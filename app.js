import './App/Components/menu/habitationCard.js';
import { getHabitaciones } from './Apis/Gestion/habitaciones/habitacionesApi.js';
import { haySesionActiva, getUsuarioActual, cerrarSesion } from './Apis/Gestion/Sesion/sesionApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-link');
    const userPanelLink = document.getElementById('user-panel-link');

    if (haySesionActiva()) {
        const usuario = getUsuarioActual();
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = usuario.nombreCompleto;
        userPanelLink.classList.remove('hidden');
        if (usuario.rol === 'admin') {
            adminLink.classList.remove('hidden');
        }
        logoutBtn.addEventListener('click', () => {
            cerrarSesion();
            window.location.reload();
        });
    }

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