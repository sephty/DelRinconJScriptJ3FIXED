import './App/Components/menu/habitationCard.js';
import './App/Components/gestion/habitacionreg.js';
import { getHabitaciones } from './Apis/Gestion/habitaciones/habitacionesApi.js';
import { getReservas } from './Apis/Gestion/reserva/reservaApi.js';
import { haySesionActiva, getUsuarioActual, cerrarSesion, checkAdmin } from './Apis/Gestion/Sesion/sesionApi.js';
import { initUserPanel, initReservaForm } from './App/Components/reserva/reservaComponent.js';
import { initReclamos } from './App/Components/reclamos/reclamosComponent.js';
import { initAuth } from './App/Components/sesion/sesionauthComponent.js';
import { initLista } from './lista.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-link');
    const userPanelLink = document.getElementById('user-panel-link');
    const reclamosLink = document.getElementById('reclamos-link');

    if (haySesionActiva()) {
        const usuario = getUsuarioActual();
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = usuario.nombreCompleto;
        userPanelLink.classList.remove('hidden');
        reclamosLink.classList.remove('hidden');
        if (usuario.rol === 'admin') {
            adminLink.classList.remove('hidden');
        }
        logoutBtn.addEventListener('click', () => {
            cerrarSesion();
            window.location.reload();
        });
    }

    const page = window.location.pathname.split('/').pop();

    if (page === 'index.html' || page === '') {
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
    } else if (page === 'gestion.html') {
        const searchInput = document.getElementById('search-input');
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        const dateSearchBtn = document.getElementById('date-search-btn');
        const grid = document.getElementById('habitaciones-grid');
        let allHabitaciones = [];

        const loadData = async () => {
            console.log('Loading data for gestion.html');
            const habitaciones = await getHabitaciones() || [];
            const reservas = await getReservas() || [];
            console.log('Habitaciones:', habitaciones);
            console.log('Reservas:', reservas);
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

        loadData();
    } else if (page === 'userpanel.html') {
        initUserPanel();
    } else if (page === 'reserva.html') {
        initReservaForm();
    } else if (page === 'reclamos.html') {
        initReclamos();
    } else if (page === 'iniciarsesion.html' || page === 'registro.html') {
        initAuth();
    } else if (page === 'list.html') {
        if (checkAdmin()) {
            initLista();
        }
    }
});