import { iniciarSesion, createUsuario } from '../../../Apis/Gestion/Sesion/sesionApi.js';

class AuthFormComponent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
		this.addEventListeners();
	}

	toggleView(showLogin) {
		const loginView = this.shadowRoot.querySelector('#login-view');
		const registerView = this.shadowRoot.querySelector('#register-view');
		if (!loginView || !registerView) return;

		loginView.classList.toggle('hidden', !showLogin);
		registerView.classList.toggle('hidden', showLogin);
	}

	addEventListeners() {
		const toggleToRegister = this.shadowRoot.querySelector('#toggle-to-register');
		const toggleToLogin = this.shadowRoot.querySelector('#toggle-to-login');

		toggleToRegister?.addEventListener('click', () => this.toggleView(false));
		toggleToLogin?.addEventListener('click', () => this.toggleView(true));

		const loginForm = this.shadowRoot.querySelector('#login-form');
		const registerForm = this.shadowRoot.querySelector('#register-form');

		// --- LOGIN ---
		if (loginForm) {
			loginForm.addEventListener('submit', async (e) => {
				e.preventDefault();
				const identificacion = loginForm.querySelector('#identificacion-login').value.trim();
				const password = loginForm.querySelector('#password-login').value.trim();
				const errorMsg = loginForm.querySelector('#login-error-message');
				errorMsg.textContent = '';

				try {
					const usuario = await iniciarSesion(identificacion, password);

					if (usuario) {
						sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));

						if (usuario.rol === 'admin') {
							window.location.href = 'list.html';
						} else {
							window.location.href = 'index.html';
						}
					} else {
						errorMsg.textContent = 'Identificación o contraseña incorrecta.';
					}
				} catch (err) {
					console.error('Login error:', err);
					errorMsg.textContent = 'Error al conectar con el servidor.';
				}
			});
		}

		if (registerForm) {
			registerForm.addEventListener('submit', async (e) => {
				e.preventDefault();
				const errorMsg = registerForm.querySelector('#register-error-message');
				errorMsg.textContent = '';

				const formData = new FormData(registerForm);
				const newUser = Object.fromEntries(formData.entries());

				newUser.rol = 'usuario';

				try {
					const createdUser = await createUsuario(newUser);
					if (createdUser) {
						alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
						this.toggleView(true);
						registerForm.reset();
					} else {
						errorMsg.textContent = 'Error al registrar el usuario.';
					}
				} catch (err) {
					console.error('Register error:', err);
					errorMsg.textContent = 'Error al conectar con el servidor.';
				}
			});
		}
	}

	render() {
		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="../../../css/auth.css">
			<style>
				.hidden { display: none !important; }
			</style>

			<div class="form-wrapper">
				<!-- Login View -->
				<div id="login-view">
					<h2>Iniciar Sesión</h2>
					<form id="login-form">
						<div class="input-group">
							<label for="identificacion-login">Número de identificación</label>
							<input type="text" id="identificacion-login" required>
						</div>
						<div class="input-group">
							<label for="password-login">Contraseña</label>
							<input type="password" id="password-login" required>
						</div>
						<p id="login-error-message" class="error-message"></p>
						<button type="submit" class="btn-submit">Entrar</button>
					</form>
					<p class="toggle-link" id="toggle-to-register">¿No tienes una cuenta? Regístrate</p>
				</div>

				<!-- Register View -->
				<div id="register-view" class="hidden">
					<h2>Crear Cuenta</h2>
					<form id="register-form">
						<div class="input-group">
							<label for="identificacion-register">Número de identificación</label>
							<input type="text" id="identificacion-register" name="identificacion" required>
						</div>
						<div class="input-group">
							<label for="nombreCompleto-register">Nombre completo</label>
							<input type="text" id="nombreCompleto-register" name="nombreCompleto" required>
						</div>
						<div class="input-group">
							<label for="nacionalidad-register">Nacionalidad</label>
							<select id="nacionalidad-register" name="nacionalidad" required>
								<option value="">Seleccione su nacionalidad</option>
								<option value="Colombiana">Colombiana</option>
								<option value="Extranjera">Extranjera</option>
							</select>
						</div>
						<div class="input-group">
							<label for="email-register">Correo electrónico</label>
							<input type="email" id="email-register" name="email" required>
						</div>
						<div class="input-group">
							<label for="telefono-register">Teléfono</label>
							<input type="tel" id="telefono-register" name="telefono" required>
						</div>
						<div class="input-group">
							<label for="password-register">Contraseña</label>
							<input type="password" id="password-register" name="password" required>
						</div>
						<p id="register-error-message" class="error-message"></p>
						<button type="submit" class="btn-submit">Registrarse</button>
					</form>
					<p class="toggle-link" id="toggle-to-login">¿Ya tienes una cuenta? Inicia sesión</p>
				</div>
			</div>
		`;
	}
}

customElements.define('auth-form-component', AuthFormComponent);
