
import { getUsuarioActual, haySesionActiva, cerrarSesion } from '../../../Apis/Gestion/Sesion/sesionApi.js';
import { getReservas } from '../../../Apis/Gestion/reserva/reservaApi.js';
import { getreclamos, createreclamo, deletereclamo } from '../../../Apis/Gestion/reclamos/reclamoApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!haySesionActiva()) {
        alert('Debes iniciar sesión para ver tus quejas y reclamos.');
        window.location.href = 'iniciarsesion.html';
        return;
    }

    const usuario = getUsuarioActual();
    setupUserUI(usuario);

    const addReclamoBtn = document.getElementById('add-reclamo-btn');
    const cancelReclamoBtn = document.getElementById('cancel-reclamo-btn');
    const reclamoForm = document.getElementById('reclamo-form');

    addReclamoBtn.addEventListener('click', () => {
        reclamoForm.classList.remove('hidden');
    });

    cancelReclamoBtn.addEventListener('click', () => {
        reclamoForm.classList.add('hidden');
    });

    await loadReservas(usuario.id);
    await loadReclamos(usuario.id);

    reclamoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCreateReclamo(usuario.id);
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

async function loadReservas(usuarioId) {
    const reservaSelect = document.getElementById('reserva-select');
    reservaSelect.innerHTML = '<option value="">Cargando...</option>';
    
    try {
        const reservas = await getReservas();
        const userReservas = reservas.filter(r => r.usuarioId === usuarioId);

        reservaSelect.innerHTML = ''; 
        if (userReservas.length === 0) {
            reservaSelect.innerHTML = '<option value="">No tienes reservas</option>';
            return;
        }

        userReservas.forEach(reserva => {
            const option = document.createElement('option');
            option.value = reserva.id;
            option.textContent = `Reserva #${reserva.id} - Habitación ${reserva.habitacionId}`;
            reservaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las reservas:', error);
        reservaSelect.innerHTML = '<option value="">Error al cargar reservas</option>';
    }
}

async function loadReclamos(usuarioId) {
    const reclamosTableBody = document.querySelector('#reclamos-table tbody');
    reclamosTableBody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';

    try {
        const [reclamos, reservas] = await Promise.all([getreclamos(), getReservas()]);
        const userReclamos = reclamos.filter(rec => rec.usuarioId === usuarioId);

        reclamosTableBody.innerHTML = '';
        if (userReclamos.length === 0) {
            reclamosTableBody.innerHTML = '<tr><td colspan="7">No has realizado ninguna queja o reclamo.</td></tr>';
            return;
        }

        const reservasMap = new Map(reservas.map(r => [r.id, r]));

        userReclamos.forEach(reclamo => {
            const reserva = reservasMap.get(reclamo.reservaId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>Reserva #${reclamo.reservaId}</td>
                <td>${reclamo.asunto}</td>
                <td>${reclamo.tipo}</td>
                <td>${new Date(reclamo.fecha).toLocaleDateString()}</td>
                <td>${reclamo.estado}</td>
                <td>${reclamo.respuestaAdmin || 'Sin respuesta'}</td>
                <td>
                    ${reclamo.estado === 'Pendiente' ? `<button class="btn btn-danger delete-btn" data-id="${reclamo.id}">Eliminar</button>` : ''}
                </td>
            `;
            reclamosTableBody.appendChild(tr);
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const reclamoId = e.target.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar esta queja/reclamo?')) {
                    await handleDeleteReclamo(reclamoId, usuarioId);
                }
            });
        });

    } catch (error) {
        console.error('Error al cargar los reclamos:', error);
        reclamosTableBody.innerHTML = '<tr><td colspan="7">Error al cargar el historial.</td></tr>';
    }
}

async function handleCreateReclamo(usuarioId) {
    const reclamoForm = document.getElementById('reclamo-form');
    const reservaId = document.getElementById('reserva-select').value;
    const asunto = document.getElementById('reclamo-asunto').value;
    const tipo = document.getElementById('reclamo-tipo').value;
    const descripcion = document.getElementById('reclamo-descripcion').value;

    if (!reservaId || !asunto || !tipo || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const nuevoReclamo = {
        usuarioId,
        reservaId: parseInt(reservaId),
        asunto,
        tipo,
        descripcion,
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
        respuestaAdmin: ''
    };

    try {
        await createreclamo(nuevoReclamo);
        alert('Queja o reclamo enviado correctamente.');
        reclamoForm.reset();
        reclamoForm.classList.add('hidden');
        await loadReclamos(usuarioId);
    } catch (error) {
        console.error('Error al crear el reclamo:', error);
        alert('Hubo un error al enviar tu queja/reclamo. Inténtalo de nuevo.');
    }
}

async function handleDeleteReclamo(reclamoId, usuarioId) {
    try {
        await deletereclamo(reclamoId);
        alert('Queja o reclamo eliminado correctamente.');
        await loadReclamos(usuarioId);
    } catch (error) {
        console.error('Error al eliminar el reclamo:', error);
        alert('Hubo un error al eliminar la queja/reclamo. Inténtalo de nuevo.');
    }
}
