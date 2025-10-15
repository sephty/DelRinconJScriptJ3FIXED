import { haySesionActiva, getUsuarioActual, cerrarSesion } from './Apis/Gestion/Sesion/sesionApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const adminLink = document.getElementById('admin-link');
    const userPanelLink = document.getElementById('user-panel-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');
    const mobileUserPanelLink = document.getElementById('mobile-user-panel-link');

    if (haySesionActiva()) {
        const usuario = getUsuarioActual();
        if (usuario) {
            loginBtn?.classList.add('hidden');
            userInfo?.classList.remove('hidden');
            usernameDisplay.textContent = usuario.nombreCompleto;

            userPanelLink?.classList.remove('hidden');
            mobileUserPanelLink?.classList.remove('hidden');

            if (usuario.rol === 'admin') {
                adminLink?.classList.remove('hidden');
                mobileAdminLink?.classList.remove('hidden');
            }

            mobileLoginBtn?.classList.add('hidden');
            mobileLogoutBtn?.classList.remove('hidden');
        }

        const handleLogout = () => {
            cerrarSesion();
            window.location.reload();
        };
        logoutBtn?.addEventListener('click', handleLogout);
        mobileLogoutBtn?.addEventListener('click', handleLogout);
    }
});