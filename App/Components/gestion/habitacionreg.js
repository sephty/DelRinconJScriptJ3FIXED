class HabitacionReg extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set habitacion(data) {
    const isReserved = data.isReserved;
    const imageSrc = data.imagenes?.length
      ? `./images/${data.imagenes[0]}`
      : `https://placehold.co/600x400?text=${encodeURIComponent(data.tipo)}`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100%; }
        .card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          background: #fff;
          transition: transform 0.2s ease-in-out;
        }
        .card:hover { transform: translateY(-5px); }
        .card.is-reserved { background-color: #f1f1f1; filter: grayscale(80%); }
        .card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .card-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        h3 { margin: 0 0 0.5rem 0; }
        p { font-size: 0.9rem; flex-grow: 1; color: #555; }
        .price { font-weight: bold; color: var(--color-primary); }
        .reserve-button {
          display: block;
          margin-top: 1rem;
          padding: 0.7rem;
          border-radius: 50px;
          background-color: var(--color-primary);
          color: white;
          text-align: center;
          text-decoration: none;
          font-weight: 500;
        }
        .reserve-button.disabled {
          background-color: #999;
          cursor: not-allowed;
          pointer-events: none;
        }
      </style>
      <div class="card ${isReserved ? 'is-reserved' : ''}">
        <img class="card-image" src="${imageSrc}" alt="Habitación ${data.tipo}">
        <div class="card-content">
          <h3>${data.tipo}</h3>
          <p>${data.descripcion}</p>
          <span class="price">$${data.precioNoche}/noche</span>
          <a href="#" class="reserve-button ${isReserved ? 'disabled' : ''}">
            ${isReserved ? 'No Disponible' : 'Reservar Ahora'}
          </a>
        </div>
      </div>
    `;

    if (!isReserved) {
      this.shadowRoot.querySelector('.reserve-button').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.setItem('selectedHabitacionId', data.id);
        window.location.href = 'reserva.html';
      });
    }
  }
}

customElements.define('habitacion-reg', HabitacionReg);

