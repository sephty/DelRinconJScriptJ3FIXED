import { getHabitacionById } from './Apis/Gestion/habitaciones/habitacionesApi.js';
import { createReserva } from './Apis/Gestion/reserva/reservaApi.js';
import { haySesionActiva, getUsuarioIdActual } from './Apis/Gestion/Sesion/sesionApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    const habitacionId = sessionStorage.getItem('selectedHabitacionId');
    const mainContainer = document.querySelector('.reserva-container');

    if (!habitacionId) {
        mainContainer.innerHTML = '<h1>Error</h1><p>No se ha seleccionado ninguna habitación. Por favor, vuelve al <a href="gestion.html">catálogo</a>.</p>';
        return;
    }

    const tipoEl = document.getElementById('habitacion-tipo');
    const descEl = document.getElementById('habitacion-descripcion');
    const precioEl = document.getElementById('habitacion-precio');
    const huespedesInput = document.getElementById('cantidad-huespedes');
    const form = document.getElementById('reserva-form');
    const statusMsg = document.getElementById('form-status-message');

    const habitacion = await getHabitacionById(habitacionId);
    
    if (!habitacion) {
        mainContainer.innerHTML = '<h1>Error</h1><p>La habitación seleccionada no existe.</p>';
        return;
    }
    
    tipoEl.textContent = habitacion.tipo;
    descEl.textContent = habitacion.descripcion;
    precioEl.textContent = habitacion.precioNoche;
    huespedesInput.max = habitacion.capacidadPersonas;

    const updateTotal = () => {
        const fechaLlegada = new Date(document.getElementById('fecha-llegada').value);
        const fechaSalida = new Date(document.getElementById('fecha-salida').value);
        const nochesCalculadasEl = document.getElementById('noches-calculadas');
        const totalPriceEl = document.getElementById('total-price');

        if (fechaSalida > fechaLlegada) {
            const diffTime = Math.abs(fechaSalida - fechaLlegada);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nochesCalculadasEl.textContent = diffDays;
            totalPriceEl.textContent = diffDays * habitacion.precioNoche;
        } else {
            nochesCalculadasEl.textContent = 0;
            totalPriceEl.textContent = 0;
        }
    };
    
    form.addEventListener('input', updateTotal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusMsg.textContent = '';

        if (!haySesionActiva()) {
            statusMsg.textContent = 'Debes iniciar sesión para poder realizar una reserva.';
            return;
        }
        
        const usuarioId = getUsuarioIdActual();
        const fechaLlegada = document.getElementById('fecha-llegada').value;
        const fechaSalida = document.getElementById('fecha-salida').value;
        const cantidadHuespedes = document.getElementById('cantidad-huespedes').value;

        if (new Date(fechaSalida) <= new Date(fechaLlegada)) {
            statusMsg.textContent = 'La fecha de salida debe ser posterior a la de llegada.';
            return;
        }

        const nuevaReserva = {
            usuarioId: parseInt(usuarioId),
            habitacionId: parseInt(habitacionId),
            fechaLlegada,
            fechaSalida,
            cantidadHuespedes: parseInt(cantidadHuespedes),
            estado: 'confirmada',
            fechaReserva: new Date().toISOString(),
            totalPagado: parseInt(document.getElementById('total-price').textContent)
        };

        const reservaCreada = await createReserva(nuevaReserva);

        if (reservaCreada) {
            alert('¡Reserva realizada con éxito!');
            sessionStorage.removeItem('selectedHabitacionId');
            window.location.href = 'index.html';
        } else {
            statusMsg.textContent = 'Hubo un error al procesar tu reserva. Inténtalo de nuevo.';
        }
    });
});