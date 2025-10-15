import { getUsuarioActual, haySesionActiva, cerrarSesion } from '../../../Apis/Gestion/Sesion/sesionApi.js';
import { getReservas, deleteReserva } from '../../../Apis/Gestion/reserva/reservaApi.js';
import { getHabitaciones } from '../../../Apis/Gestion/habitaciones/habitacionesApi.js';

const UI_STRINGS = {
  LOGIN_REQUIRED: 'Debes iniciar sesión para ver tus reservas.',
  NO_RESERVAS: 'No tienes reservas actualmente.',
  ERROR_LOADING: 'Error al cargar tus reservas. Por favor, inténtalo de nuevo más tarde.',
  CONFIRM_CANCEL: '¿Estás seguro de que deseas cancelar esta reserva?',
  CANCEL_SUCCESS: 'Reserva cancelada correctamente.',
  UNKNOWN_ROOM: 'Habitación Desconocida'
};

const setupSession = () => {
  if (!haySesionActiva()) {
    alert(UI_STRINGS.LOGIN_REQUIRED);
    window.location.href = 'iniciarsesion.html';
    return null;
  }

  const usuario = getUsuarioActual();
  const userInfo = document.getElementById('user-info');
  const loginBtn = document.getElementById('login-btn');
  const usernameDisplay = document.getElementById('username-display');
  const logoutBtn = document.getElementById('logout-btn');

  usernameDisplay.textContent = usuario.nombreCompleto || 'Usuario';
  userInfo.classList.remove('hidden');
  loginBtn.classList.add('hidden');

  logoutBtn.addEventListener('click', () => {
    cerrarSesion();
    window.location.href = 'index.html';
  });

  return usuario;
};

const createReservaCard = (reserva, habitacion) => {
  const card = document.createElement('div');
  card.classList.add('reserva-card');

  const habitacionTipo = habitacion?.tipo || UI_STRINGS.UNKNOWN_ROOM;
  const totalPagado = reserva.totalPagado ?? 0;

  card.innerHTML = `
    <h3>${habitacionTipo}</h3>
    <p><strong>Fechas:</strong> ${reserva.fechaLlegada} - ${reserva.fechaSalida}</p>
    <p><strong>Huéspedes:</strong> ${reserva.cantidadHuespedes}</p>
    <p><strong>Precio Total:</strong> $${totalPagado}</p>
    <button class="cancelar-btn" data-id="${reserva.id}">Cancelar Reserva</button>
  `;
  return card;
};

const renderReservas = (reservas, habitaciones, container) => {
  container.innerHTML = '';
  if (reservas.length === 0) {
    container.innerHTML = `<p>${UI_STRINGS.NO_RESERVAS}</p>`;
    return;
  }

  const habitacionesMap = new Map(habitaciones.map(h => [h.id.toString(), h]));

  reservas.forEach(reserva => {
    const habitacion = habitacionesMap.get(reserva.habitacionId.toString());
    const card = createReservaCard(reserva, habitacion);
    container.appendChild(card);
  });
};

const handleCancelation = (container) => {
  container.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('cancelar-btn')) return;

    const reservaId = e.target.dataset.id;
    if (confirm(UI_STRINGS.CONFIRM_CANCEL)) {
      await deleteReserva(reservaId);
      alert(UI_STRINGS.CANCEL_SUCCESS);
      window.location.reload();
    }
  });
};

export const initUserPanel = async () => {
  const reservasContainer = document.getElementById('reservas-container');
  const usuario = setupSession();

  if (!usuario) return;

  try {
    const [reservas, habitaciones] = await Promise.all([
      getReservas(),
      getHabitaciones()
    ]);
    
    const misReservas = reservas.filter(r => r.usuarioId.toString() === usuario.id.toString());
    renderReservas(misReservas, habitaciones, reservasContainer);
    handleCancelation(reservasContainer);
  } catch (error) {
    console.error('Error cargando reservas:', error);
    reservasContainer.innerHTML = `<p>${UI_STRINGS.ERROR_LOADING}</p>`;
  }
};