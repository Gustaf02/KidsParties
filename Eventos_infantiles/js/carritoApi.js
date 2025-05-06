const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125';

/**
 * Clase Cart: Gestiona las operaciones del carrito de compras
 * Incluye manejo de items, totales y fechas reservadas
 */
class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.reservedDates = new Set();
  }

  /**
   * Agrega un item al carrito
   * @param {Object} item - Objeto con los datos del servicio a agregar
   * @throws {Error} Si la fecha no está disponible
   */
  addItem(item) {
    if (!this.isDateAvailable(item.fecha)) {
      throw new Error('Fecha no disponible');
    }

    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ ...item, quantity: 1 });
      this.reservedDates.add(item.fecha);
    }
    this.calculateTotal();
  }

  /**
   * Elimina un item del carrito
   * @param {string} itemId - ID del servicio a eliminar
   */
  removeItem(itemId) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) return;

    const item = this.items[index];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.items.splice(index, 1);
      this.reservedDates.delete(item.fecha);
    }
    this.calculateTotal();
  }

  /**
   * Verifica disponibilidad de una fecha
   * @param {string} date - Fecha a verificar
   * @returns {boolean} True si la fecha está disponible
   */
  isDateAvailable(date) {
    return !this.reservedDates.has(date);
  }

  /**
   * Calcula el total del carrito
   */
  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  }

  /**
   * Finaliza la reserva y guarda en localStorage
   */
  checkout() {
    const reservation = {
      items: this.items,
      total: this.total,
      fecha: new Date().toISOString()
    };
    localStorage.setItem('reserva', JSON.stringify(reservation));
    this.clear();
  }

  /**
   * Vacía el carrito
   */
  clear() {
    this.items = [];
    this.total = 0;
    this.reservedDates.clear();
  }
}

/**
 * Obtiene y combina datos de ambas APIs
 * @returns {Promise<Array>} Array de servicios combinados con imágenes
 */
async function fetchCombinedData() {
  try {
    const [imagesResponse, salonesResponse] = await Promise.all([
      fetch('https://api.pexels.com/v1/search?query=birthday&per_page=6', {
        headers: { 'Authorization': API_KEY }
      }),
      fetch('https://681a090f1ac1155635078a8f.mockapi.io/salones')
    ]);

    const imagesData = await imagesResponse.json();
    const salonesData = await salonesResponse.json();
    console.log(salonesData);


    return salonesData.map((salon, index) => ({
      ...salon,
      imagen: imagesData.photos[index % imagesData.photos.length]?.src.medium || ''
    })).slice(0, Math.min(salonesData.length, imagesData.photos.length));

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

/**
 * Renderiza el catálogo en el DOM
 * @param {Array} data - Array de servicios a mostrar
 */
function renderCatalog(data) {
  const container = document.getElementById('catalogo-container');
  
  container.innerHTML = data.map(item => `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${item.imagen}" 
             class="card-img-top" 
             alt="${item.nombre}"
             style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${item.nombre}</h5>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-primary">Capacidad: ${item.capacidad}</span>
            <h5 class="text-success mb-0">$${item.precio.toLocaleString('es-AR')}</h5>
          </div>
          <p class="mt-2"><small class="text-muted">Disponible en: ${item.fecha}</small></p>
          <button class="btn btn-primary w-100" 
                  onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            <i class="bi bi-cart-plus"></i> Reservar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Agrega un servicio al carrito
 * @param {Object} item - Servicio a agregar
 */
function addToCart(item) {
  try {
    cart.addItem({
      ...item,
      fecha: item.fecha
    });
    showAlert('¡Servicio agregado al carrito!', 'success');
    updateCartDisplay();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

/**
 * Actualiza la visualización del carrito
 */
function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  
  cartItems.innerHTML = cart.items.map((item, index) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <h6 class="mb-1">${item.nombre}</h6>
        <small class="text-muted">${item.quantity} x $${item.precio}</small>
      </div>
      <div>
        <span class="me-2">$${item.quantity * item.precio}</span>
        <button class="btn btn-sm btn-danger" onclick="cart.removeItem('${item.id}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </li>
  `).join('');
  
  totalElement.textContent = cart.total.toLocaleString('es-AR');
}

/**
 * Muestra notificaciones al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta (success, danger, etc.)
 */
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('cart-alerts');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  alertContainer.appendChild(alert);
  
  setTimeout(() => alert.remove(), 3000);
}

// Inicialización de la aplicación
(async () => {
  try {
    window.cart = new Cart(); // Hacemos el carrito global
    const combinedData = await fetchCombinedData();
    renderCatalog(combinedData);
    updateCartDisplay(); // Actualizar carrito inicial
    
    // Ejemplo de interacción inicial
    cart.addItem({ ...combinedData[0], fecha: combinedData[0].fecha });
    
  } catch (error) {
    console.error('Error inicial:', error);
    showAlert('Error al cargar los datos', 'danger');
  }
})();