import { getUsuarioActual, haySesionActiva, cerrarSesion, getUsuarios, checkAdmin } from '../../../Apis/Gestion/Sesion/sesionApi.js';
import { getreclamos, updatereclamo, getreclamoById } from '../../../Apis/Gestion/reclamos/reclamoApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAdmin()) {
        return;
    }

    const usuario = getUsuarioActual();
    setupUserUI(usuario);

    await loadReclamos();

    const modal = document.getElementById('respuesta-modal');
    const closeBtn = document.querySelector('.close-btn');
    const respuestaForm = document.getElementById('respuesta-form');

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    respuestaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleUpdateReclamo();
    });
});

function setupUserUI(usuario) {
    const userInfo = document.getElementById('user-info');
    const loginBtn = document.getElementById('login-btn');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-link');
    const userPanelLink = document.getElementById('user-panel-link');

    if (usuario) {
        usernameDisplay.textContent = usuario.nombre;
        userInfo.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        userPanelLink.classList.remove('hidden');

        if (usuario.esAdmin) {
            adminLink.classList.remove('hidden');
        }

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
            window.location.href = 'index.html';
        });
    }
}

async function loadReclamos() {
    const reclamosTableBody = document.querySelector('#gestion-reclamos-table tbody');
    reclamosTableBody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';

    try {
        const [reclamos, usuarios] = await Promise.all([getreclamos(), getUsuarios()]);
        const usuariosMap = new Map(usuarios.map(u => [u.id, u.nombre]));

        reclamosTableBody.innerHTML = '';
        if (reclamos.length === 0) {
            reclamosTableBody.innerHTML = '<tr><td colspan="6">No hay quejas o reclamos.</td></tr>';
            return;
        }

        reclamos.forEach(reclamo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(reclamo.fecha).toLocaleDateString()}</td>
                <td>${reclamo.tipo}</td>
                <td>${reclamo.asunto}</td>
                <td>${usuariosMap.get(reclamo.usuarioId) || 'Usuario no encontrado'}</td>
                <td>${reclamo.estado}</td>
                <td>
                    <button class="btn btn-primary responder-btn" data-id="${reclamo.id}">Responder</button>
                </td>
            `;
            reclamosTableBody.appendChild(tr);
        });

        document.querySelectorAll('.responder-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const reclamoId = e.target.dataset.id;
                openRespuestaModal(reclamoId);
            });
        });

    } catch (error) {
        console.error('Error al cargar los reclamos:', error);
        reclamosTableBody.innerHTML = '<tr><td colspan="6">Error al cargar el historial.</td></tr>';
    }
}

function openRespuestaModal(reclamoId) {
    const modal = document.getElementById('respuesta-modal');
    const reclamoIdInput = document.getElementById('respuesta-reclamo-id');
    reclamoIdInput.value = reclamoId;
    modal.classList.remove('hidden');
}

async function handleUpdateReclamo() {
    const modal = document.getElementById('respuesta-modal');
    const reclamoId = document.getElementById('respuesta-reclamo-id').value;
    const respuesta = document.getElementById('respuesta-texto').value;
    const estado = document.getElementById('respuesta-estado').value;

    if (!respuesta) {
        alert('Por favor, escribe una respuesta.');
        return;
    }

    try {
        const reclamo = await getreclamoById(reclamoId); 
        const datosActualizados = {
            ...reclamo,
            respuestaAdmin: respuesta,
            estado: estado
        };

        await updatereclamo(reclamoId, datosActualizados);
        alert('Respuesta enviada correctamente.');
        modal.classList.add('hidden');
        document.getElementById('respuesta-form').reset();
        await loadReclamos();
    } catch (error) {
        console.error('Error al actualizar el reclamo:', error);
        alert('Hubo un error al enviar la respuesta. Inténtalo de nuevo.');
    }
}
