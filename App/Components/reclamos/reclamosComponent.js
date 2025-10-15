import { getUsuarioActual, haySesionActiva, cerrarSesion } from '../../../Apis/Gestion/Sesion/sesionApi.js';
import { getReservas } from '../../../Apis/Gestion/reserva/reservaApi.js';
import { getHabitaciones } from '../../../Apis/Gestion/habitaciones/habitacionesApi.js';

const UI_STRINGS = {
  LOGIN_REQUIRED: 'Debes iniciar sesión para hacer un reclamo.',
  NO_RESERVAS: 'No tienes reservas actualmente.',
  ERROR_LOADING: 'Error al cargar tus reservas. Por favor, inténtalo de nuevo más tarde.',
  CONFIRM_POST: '¿Esta todo completo?',
  POST_SUCCESS: 'Reclamo hecho correctamente.',
  UNKNOWN_RES: 'Reserva Desconocida'
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


const 