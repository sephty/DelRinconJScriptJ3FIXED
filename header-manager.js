// Header management script
// Handles admin visibility and login/logout UI

import { haySesionActiva, getUsuarioActual, cerrarSesion } from './Apis/Gestion/Sesion/sesionApi.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const usernameDisplay = document.getElementById('username-display');
  const logoutBtn = document.getElementById('logout-btn');
  const adminLink = document.querySelector('a[href="list.html"]');
  
  // Update header based on session
  if (haySesionActiva()) {
    const usuario = getUsuarioActual();
    
    // Show user info
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userInfo) userInfo.classList.remove('hidden');
    if (usernameDisplay) usernameDisplay.textContent = usuario.nombreCompleto || usuario.nombre || 'Usuario';
    
    // Show admin link only if user is admin
    if (adminLink) {
      if (usuario.rol === 'admin') {
        adminLink.style.display = 'inline';
      } else {
        adminLink.style.display = 'none';
      }
    }
    
    // Logout handler
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
        window.location.href = 'index.html';
      });
    }
  } else {
    // Not logged in - show login button
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userInfo) userInfo.classList.add('hidden');
    if (adminLink) adminLink.style.display = 'none';
  }
});
