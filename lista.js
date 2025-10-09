const API_URL = "http://localhost:3000";

// --- Access Control ---
document.addEventListener("DOMContentLoaded", () => {
	const user = JSON.parse(localStorage.getItem("currentUser"));

	if (!user) {
		alert("Debes iniciar sesión para acceder al panel.");
		window.location.href = "iniciarsesion.html";
		return;
	}

	if (user.role !== "admin") {
		alert("Acceso restringido. Solo administradores pueden ingresar.");
		window.location.href = "index.html";
		return;
	}

	// Mostrar nombre y botón de logout
	document.getElementById("login-btn").classList.add("hidden");
	const info = document.getElementById("user-info");
	info.classList.remove("hidden");
	document.getElementById("username-display").textContent = user.name;

	document.getElementById("logout-btn").addEventListener("click", () => {
		localStorage.removeItem("currentUser");
		window.location.href = "index.html";
	});

	loadUsuarios();
	loadHabitaciones();
	loadReservas();
});

// --- Tabs switching ---
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

// --- Usuarios ---
async function loadUsuarios() {
	const res = await fetch(`${API_URL}/users`);
	const data = await res.json();

	const tbody = document.querySelector("#usuarios-table tbody");
	tbody.innerHTML = "";
	data.forEach(u => {
		tbody.innerHTML += `
			<tr>
				<td>${u.id}</td>
				<td>${u.name}</td>
				<td>${u.email}</td>
				<td>${u.phone}</td>
				<td>${u.role}</td>
				<td>
					<button class="action delete" onclick="deleteUser('${u.id}')">Eliminar</button>
				</td>
			</tr>`;
	});
}

async function deleteUser(id) {
	if (!confirm("¿Eliminar este usuario?")) return;
	await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
	loadUsuarios();
}

// --- Habitaciones ---
async function loadHabitaciones() {
	const res = await fetch(`${API_URL}/rooms`);
	const data = await res.json();

	const tbody = document.querySelector("#habitaciones-table tbody");
	tbody.innerHTML = "";
	data.forEach(r => {
		tbody.innerHTML += `
			<tr>
				<td>${r.id}</td>
				<td>${r.name}</td>
				<td>$${r.price}</td>
				<td>${r.maxPeople}</td>
				<td>${r.services.join(", ")}</td>
				<td>
					<button class="action delete" onclick="deleteRoom('${r.id}')">Eliminar</button>
				</td>
			</tr>`;
	});
}

async function deleteRoom(id) {
	if (!confirm("¿Eliminar esta habitación?")) return;
	await fetch(`${API_URL}/rooms/${id}`, { method: "DELETE" });
	loadHabitaciones();
}

// --- Reservas ---
async function loadReservas() {
	const res = await fetch(`${API_URL}/reservations`);
	const data = await res.json();

	const tbody = document.querySelector("#reservas-table tbody");
	tbody.innerHTML = "";
	data.forEach(r => {
		tbody.innerHTML += `
			<tr>
				<td>${r.id}</td>
				<td>${r.userName}</td>
				<td>${r.roomName}</td>
				<td>${r.from}</td>
				<td>${r.to}</td>
				<td>${r.status}</td>
				<td>
					<button class="action delete" onclick="deleteReserva('${r.id}')">Eliminar</button>
				</td>
			</tr>`;
	});
}

async function deleteReserva(id) {
	if (!confirm("¿Eliminar esta reserva?")) return;
	await fetch(`${API_URL}/reservations/${id}`, { method: "DELETE" });
	loadReservas();
}

