import { getUsuarioActual, haySesionActiva, cerrarSesion } from '../Apis/Gestion/Sesion/sesionApi.js';
import { getReservas, deleteReserva } from '../Apis/Gestion/Reservas/reservasApi.js';
import { getHabitaciones } from '../Apis/Gestion/Habitaciones/habitacionesApi.js';

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
        <h3>${habitacion?.nombre || 'Habitación Desconocida'}</h3>
        <p><strong>Fechas:</strong> ${reserva.fechaEntrada} - ${reserva.fechaSalida}</p>
        <p><strong>Huéspedes:</strong> ${reserva.cantidadHuespedes}</p>
        <p><strong>Precio Total:</strong> $${reserva.total || 0}</p>
        <button class="cancelar-btn" data-id="${reserva.id}">Cancelar Reserva</button>
      `;
      reservasContainer.appendChild(div);
    });

    // Manejo de cancelaciones
    reservasContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('cancelar-btn')) {
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
