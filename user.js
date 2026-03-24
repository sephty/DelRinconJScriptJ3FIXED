import { getUsuarioActual, haySesionActiva, cerrarSesion } from './Apis/Gestion/Sesion/sesionApi.js';
import { getReservas, deleteReserva } from './Apis/Gestion/reserva/reservaApi.js';
import { getHabitaciones } from './Apis/Gestion/habitaciones/habitacionesApi.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userInfo = document.getElementById('user-info');
  const loginBtn = document.getElementById('login-btn');
  const usernameDisplay = document.getElementById('username-display');
  const logoutBtn = document.getElementById('logout-btn');
  const reservasContainer = document.getElementById('reservas-container');

  // Verificar si hay sesión
  if (!haySesionActiva()) {
    alert('Debes iniciar sesión para ver tus reservas.');
    window.location.href = 'iniciarsesion.html';
    return;
  }

  const usuario = getUsuarioActual();
  usernameDisplay.textContent = usuario.nombreCompleto || usuario.username;
  userInfo.classList.remove('hidden');
  loginBtn.classList.add('hidden');

  logoutBtn.addEventListener('click', () => {
    cerrarSesion();
    window.location.href = 'index.html';
  });

  try {
    const [reservas, habitaciones] = await Promise.all([
      getReservas(),
      getHabitaciones()
    ]);

    const misReservas = reservas.filter(r => r.usuarioId === usuario.id);

    if (misReservas.length === 0) {
      reservasContainer.innerHTML = `<p>No tienes reservas actualmente.</p>`;
      return;
    }

    reservasContainer.innerHTML = '';

    misReservas.forEach(reserva => {
      const habitacion = habitaciones.find(h => h.id === reserva.habitacionId);
      const div = document.createElement('div');
      div.classList.add('reserva-card');
      div.innerHTML = `
        <h3>${habitacion?.tipo || 'Habitación Desconocida'}</h3>
        <p><strong>Fechas:</strong> ${reserva.fechaLlegada} - ${reserva.fechaSalida}</p>
        <p><strong>Huéspedes:</strong> ${reserva.cantidadHuespedes}</p>
        <p><strong>Precio Total:</strong> $${reserva.totalPagado || 0}</p>
        <p><strong>Estado:</strong> ${reserva.estado}</p>
        <button class="cancel-btn" data-id="${reserva.id}">Cancelar Reserva</button>
      `;
      reservasContainer.appendChild(div);
    });

    // Manejo de cancelaciones
    reservasContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('cancel-btn')) {
        const id = e.target.dataset.id;
        if (confirm('¿Deseas cancelar esta reserva?')) {
          await deleteReserva(id);
          alert('Reserva cancelada correctamente.');
          location.reload();
        }
      }
    });

  } catch (error) {
    console.error('Error cargando reservas:', error);
    reservasContainer.innerHTML = `<p>Error al cargar tus reservas.</p>`;
  }
});
