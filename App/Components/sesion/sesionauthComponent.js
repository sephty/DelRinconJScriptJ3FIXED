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
							window.location.href = 'userpanel.html';
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
			<style>
				:host {
					display: block;
					font-family: Arial, sans-serif;
				}
				.hidden { display: none !important; }
				.form-wrapper {
					background: white;
					padding: 2.5rem 2rem 2rem 2rem;
					border-radius: 8px;
					width: 100%;
					max-width: 420px;
					box-shadow: 0 4px 15px rgba(0,0,0,0.1);
				}
				.form-wrapper form {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}
				.form-wrapper input, .form-wrapper select {
					padding: 0.8rem;
					border: 1px solid #ccc;
					border-radius: 4px;
				}
				.form-wrapper button {
					padding: 0.8rem;
					background-color: var(--color-primary, #3b82f6);
					color: white;
					border: none;
					border-radius: 4px;
					cursor: pointer;
				}
				.form-wrapper button:hover {
					background-color: #2563eb;
				}
				.toggle-link {
					color: var(--color-primary, #3b82f6);
					text-decoration: underline;
					cursor: pointer;
					text-align: center;
					margin-top: 1rem;
					font-size: 0.9rem;
				}
				.error-message {
					color: red;
					font-size: 0.9rem;
					min-height: 1.2em;
					text-align: center;
					margin-top: 0.5rem;
				}
			</style>

			<div class="form-wrapper">
				<div id="login-view">
					<h3>Iniciar Sesión</h3>
					<form id="login-form">
						<input type="text" id="identificacion-login" placeholder="Número de identificación" required>
						<input type="password" id="password-login" placeholder="Contraseña" required>
						<p id="login-error-message" class="error-message"></p>
						<button type="submit">Entrar</button>
					</form>
					<p class="toggle-link" id="toggle-to-register">¿No tienes una cuenta? Regístrate</p>
				</div>

				<div id="register-view" class="hidden">
					<h3>Crear Cuenta</h3>
					<form id="register-form">
						<input type="text" name="identificacion" placeholder="Número de identificación" required>
						<input type="text" name="nombreCompleto" placeholder="Nombre completo" required>
						<select name="nacionalidad" required>
							<option value="">Seleccione su nacionalidad</option>
							<option value="Colombiana">Colombiana</option>
							<option value="Extranjera">Extranjera</option>
						</select>
						<input type="email" name="email" placeholder="Correo electrónico" required>
						<input type="tel" name="telefono" placeholder="Teléfono" required>
						<input type="password" name="password" placeholder="Contraseña" required>
						<p id="register-error-message" class="error-message"></p>
						<button type="submit">Registrarse</button>
					</form>
					<p class="toggle-link" id="toggle-to-login">¿Ya tienes una cuenta? Inicia sesión</p>
				</div>
			</div>
		`;
	}
}

customElements.define('auth-form-component', AuthFormComponent);
