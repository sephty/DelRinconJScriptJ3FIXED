import { getUsuarios, getUsuarioById, updateUsuario, deleteUsuario, createUsuario, checkAdmin, getUsuarioActual, cerrarSesion } from './Apis/Gestion/Sesion/sesionApi.js';
import { getHabitaciones, getHabitacionById, updateHabitacion, deleteHabitacion, createHabitacion } from './Apis/Gestion/habitaciones/habitacionesApi.js';
import { getReservas, getReservaById, updateReserva, deleteReserva, createReserva } from './Apis/Gestion/reserva/reservaApi.js';

// Modal elements
const modal = document.getElementById('admin-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close-btn');

export const initLista = async () => {
    if (!checkAdmin()) {
        return;
    }

    const user = getUsuarioActual();
    document.getElementById("login-btn").classList.add("hidden");
    const info = document.getElementById("user-info");
    info.classList.remove("hidden");
    document.getElementById("username-display").textContent = user.nombreCompleto;

    document.getElementById("logout-btn").addEventListener("click", () => {
        cerrarSesion();
        window.location.href = "index.html";
    });

    setupEventListeners();

    loadUsuarios();
    loadHabitaciones();
    loadReservas();
    
    // Add a data-section attribute to each form in list.html
    document.getElementById('usuario-form').dataset.section = 'usuarios';
    document.getElementById('habitacion-form').dataset.section = 'habitaciones';
    document.getElementById('reserva-form').dataset.section = 'reservas';
};

document.querySelectorAll(".admin-tabs button").forEach(btn => {
	btn.addEventListener("click", () => {
		document.querySelectorAll(".admin-tabs button").forEach(b => b.classList.remove("active"));
		btn.classList.add("active");

		const tab = btn.dataset.tab;
		document.querySelectorAll(".tab-content").forEach(sec => {
			sec.classList.remove("active");
			if (sec.id === tab) sec.classList.add("active");
		});
	});
});

const openModal = (title, form) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = '';
    modalBody.appendChild(form);
    form.classList.remove('hidden');
    modal.classList.remove('hidden');
};

const closeModal = () => {
    const form = modalBody.querySelector('.admin-form');
    if (form) {
        document.querySelector(`#${form.dataset.section}`).appendChild(form);
        form.classList.add('hidden');
    }
    modal.classList.add('hidden');
};

const createCell = (text, label) => {
    const cell = document.createElement('td');
    cell.textContent = text;
    if (label) {
        cell.dataset.label = label;
    }
    return cell;
};

const createActionsCell = (id, type) => {
    const cell = document.createElement('td');
    cell.dataset.label = 'Acciones';
    cell.classList.add('action-cell');
    cell.innerHTML = `
        <button class="action edit" data-id="${id}" data-type="${type}">Editar</button>
        <button class="action delete" data-id="${id}" data-type="${type}">Eliminar</button>
    `;
    return cell;
};

const renderTable = (data, tableId, columns, type) => {
    const table = document.getElementById(tableId);
    const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent);
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement('tr');
        columns.forEach((col, index) => {
            row.appendChild(createCell(item[col] ?? 'N/A', headers[index]));
        });
        row.appendChild(createActionsCell(item.id, type));
        tbody.appendChild(row);
    });
};

const loadUsuarios = async () => {
    const data = await getUsuarios();
    renderTable(data, 'usuarios-table', ['id', 'nombreCompleto', 'email', 'telefono', 'rol'], 'usuario');
};

const loadHabitaciones = async () => {
    const data = await getHabitaciones();
    renderTable(data, 'habitaciones-table', ['id', 'tipo', 'precioNoche', 'capacidadPersonas', 'servicios'], 'habitacion');
};

const loadReservas = async () => {
    const data = await getReservas();
    renderTable(data, 'reservas-table', ['id', 'usuarioId', 'habitacionId', 'fechaLlegada', 'fechaSalida', 'estado'], 'reserva');
};

const setupEventListeners = () => {
    document.querySelector('main').addEventListener('click', async (e) => {
        const target = e.target;
        if (target.matches('.action.delete')) {
            handleDelete(target.dataset.id, target.dataset.type);
        }
        if (target.matches('.action.edit')) {
            handleEdit(target.dataset.id, target.dataset.type);
        }
        if (target.matches('.add-btn')) {
            const formId = target.dataset.form;
            const form = document.getElementById(formId);
            form.reset();
            form.querySelector('input[type="hidden"]').value = '';
            const title = `Añadir ${formId.split('-')[0]}`;
            openModal(title, form);
        }
        if (target.matches('.cancel-btn')) {
            closeModal();
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.getElementById('usuario-form').addEventListener('submit', handleUsuarioSubmit);
    document.getElementById('habitacion-form').addEventListener('submit', handleHabitacionSubmit);
    document.getElementById('reserva-form').addEventListener('submit', handleReservaSubmit);
};

const handleDelete = async (id, type) => {
    if (!confirm(`¿Seguro que quieres eliminar este ${type}?`)) return;
    switch (type) {
        case 'usuario':
            await deleteUsuario(id);
            break;
        case 'habitacion':
            await deleteHabitacion(id);
            break;
        case 'reserva':
            await deleteReserva(id);
            break;
    }
    refreshData(type);
};

const handleEdit = async (id, type) => {
    let data;
    const form = document.getElementById(`${type}-form`);
    const title = `Editar ${type}`;

    switch (type) {
        case 'usuario':
            data = await getUsuarioById(id);
            break;
        case 'habitacion':
            data = await getHabitacionById(id);
            break;
        case 'reserva':
            data = await getReservaById(id);
            break;
    }
    
    form.reset();
    switch (type) {
        case 'usuario':
            form.querySelector('#usuario-id').value = data.id;
            form.querySelector('#usuario-nombre').value = data.nombreCompleto;
            form.querySelector('#usuario-email').value = data.email;
            form.querySelector('#usuario-identificacion').value = data.identificacion;
            form.querySelector('#usuario-telefono').value = data.telefono;
            form.querySelector('#usuario-rol').value = data.rol;
            break;
        case 'habitacion':
            form.querySelector('#habitacion-id').value = data.id;
            form.querySelector('#habitacion-tipo').value = data.tipo;
            form.querySelector('#habitacion-precio').value = data.precioNoche;
            form.querySelector('#habitacion-capacidad').value = data.capacidadPersonas;
            form.querySelector('#habitacion-descripcion').value = data.descripcion;
            form.querySelector('#habitacion-servicios').value = data.servicios?.join(', ');
            form.querySelector('#habitacion-imagenes').value = data.imagenes?.join(', ');
            form.querySelector('#habitacion-camas').value = data.camas;
            break;
        case 'reserva':
            form.querySelector('#reserva-id').value = data.id;
            form.querySelector('#reserva-usuarioId').value = data.usuarioId;
            form.querySelector('#reserva-habitacionId').value = data.habitacionId;
            form.querySelector('#reserva-fechaLlegada').value = data.fechaLlegada;
            form.querySelector('#reserva-fechaSalida').value = data.fechaSalida;
            form.querySelector('#reserva-huespedes').value = data.cantidadHuespedes;
            form.querySelector('#reserva-estado').value = data.estado;
            break;
    }
    openModal(title, form);
};

const handleUsuarioSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.querySelector('#usuario-id').value;
    const password = form.querySelector('#usuario-password').value;

    const data = {
        nombreCompleto: form.querySelector('#usuario-nombre').value,
        email: form.querySelector('#usuario-email').value,
        identificacion: form.querySelector('#usuario-identificacion').value,
        telefono: form.querySelector('#usuario-telefono').value,
        rol: form.querySelector('#usuario-rol').value,
    };

    if (id) {
        const existingUser = await getUsuarioById(id);
        data.password = password || existingUser.password;
        await updateUsuario(id, data);
    } else {
        if (!password) {
            alert('La contraseña es obligatoria para nuevos usuarios.');
            return;
        }
        data.password = password;
        await createUsuario(data);
    }

    closeModal();
    loadUsuarios();
};

const handleHabitacionSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.querySelector('#habitacion-id').value;

    const data = {
        tipo: form.querySelector('#habitacion-tipo').value,
        precioNoche: parseFloat(form.querySelector('#habitacion-precio').value),
        capacidadPersonas: parseInt(form.querySelector('#habitacion-capacidad').value),
        descripcion: form.querySelector('#habitacion-descripcion').value,
        servicios: form.querySelector('#habitacion-servicios').value.split(',').map(s => s.trim()),
        imagenes: form.querySelector('#habitacion-imagenes').value.split(',').map(s => s.trim()),
        camas: form.querySelector('#habitacion-camas').value,
        disponibilidad: [{ "desde": "2025-01-01", "hasta": "2025-12-31" }]
    };

    if (id) {
        await updateHabitacion(id, data);
    } else {
        await createHabitacion(data);
    }

    closeModal();
    loadHabitaciones();
};

const handleReservaSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.querySelector('#reserva-id').value;

    const data = {
        usuarioId: parseInt(form.querySelector('#reserva-usuarioId').value),
        habitacionId: parseInt(form.querySelector('#reserva-habitacionId').value),
        fechaLlegada: form.querySelector('#reserva-fechaLlegada').value,
        fechaSalida: form.querySelector('#reserva-fechaSalida').value,
        cantidadHuespedes: parseInt(form.querySelector('#reserva-huespedes').value),
        estado: form.querySelector('#reserva-estado').value,
        fechaReserva: new Date().toISOString()
    };

    if (id) {
        await updateReserva(id, data);
    } else {
        await createReserva(data);
    }

    closeModal();
    loadReservas();
};

const refreshData = (type) => {
    switch (type) {
        case 'usuario':
            loadUsuarios();
            break;
        case 'habitacion':
            loadHabitaciones();
            break;
        case 'reserva':
            loadReservas();
            break;
    }
};