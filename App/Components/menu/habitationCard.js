class HabitacionCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set habitacion(habitacion) {
    const imageSrc = habitacion.imagenes?.length
      ? `./images/${habitacion.imagenes[0]}`
      : `https://placehold.co/600x400?text=${encodeURIComponent(habitacion.tipo)}`;

    this.shadowRoot.innerHTML = `
      <style>
        .room-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
          background: #fff;
        }
        .room-card:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .room-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background-color: #f0f0f0;
        }
        .room-details {
          padding: 1rem;
        }
        h3 { margin: 0 0 0.3rem 0; }
        p { color: #555; font-size: 0.9rem; }
      </style>
      <div class="room-card">
        <img class="room-image" src="${imageSrc}" alt="${habitacion.tipo}">
        <div class="room-details">
          <h3>${habitacion.tipo}</h3>
          <p>${habitacion.descripcion.substring(0, 100)}...</p>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.room-card').addEventListener('click', () => {
      sessionStorage.setItem('selectedHabitacionId', habitacion.id);
      window.location.href = 'reserva.html';
    });
  }
}

customElements.define('habitacion-card', HabitacionCard);
