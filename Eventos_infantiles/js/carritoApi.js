const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125';

/**
 * Clase Cart: Gestiona las operaciones del carrito de compras

 */
class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.reservedDates = new Set();
    console.log('Carrito inicializado');
  }

  /**
   * Agrega un item al carrito
   * @param {Object} item 
   * @throws {Error} 
   */
  addItem(item) {
    if (!item || !item.id || !item.fecha) {
      console.error('Item inválido:', item);
      throw new Error('Datos del servicio incompletos');
    }

    if (!this.isDateAvailable(item.fecha)) {
      console.warn('Fecha no disponible:', item.fecha);
      throw new Error('Fecha no disponible');
    }

    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
      console.log(`Incrementado item ${item.id}, nueva cantidad: ${existingItem.quantity}`);
    } else {
      this.items.push({ ...item, quantity: 1 });
      this.reservedDates.add(item.fecha);
      console.log(`Agregado nuevo item ${item.id} para fecha ${item.fecha}`);
    }
    this.calculateTotal();
  }

  /**
   * Elimina un item del carrito
   * @param {string} itemId - 
   */
  removeItem(itemId) {
    console.log(`Intentando eliminar item ${itemId}`);
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) {
      console.warn(`Item ${itemId} no encontrado en el carrito`);
      return;
    }

    const item = this.items[index];
    if (item.quantity > 1) {
      item.quantity--;
      console.log(`Reducida cantidad del item ${itemId}, nueva cantidad: ${item.quantity}`);
    } else {
      this.items.splice(index, 1);
      this.reservedDates.delete(item.fecha);
      console.log(`Eliminado completamente el item ${itemId}`);
    }
    this.calculateTotal();
  }

  /**
   * Verifica disponibilidad de una fecha
   * @param {string} date - 
   * @returns {boolean} 
   */
  isDateAvailable(date) {
    const available = !this.reservedDates.has(date);
    console.log(`Verificando fecha ${date}: ${available ? 'Disponible' : 'No disponible'}`);
    return available;
  }

  /**
   * Calcula el total del carrito
   */
  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    console.log(`Total recalculado: $${this.total}`);
  }

  /**
   * Finaliza la reserva y guarda en localStorage
   */
  checkout() {
    console.log('Iniciando checkout...');
    if (this.items.length === 0) {
      console.warn('Intento de checkout con carrito vacío');
      throw new Error('El carrito está vacío');
    }

    const reservation = {
      items: this.items,
      total: this.total,
      fecha: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('reserva', JSON.stringify(reservation));
      console.log('Reserva guardada en localStorage:', reservation);
      this.clear();
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
      throw new Error('Error al procesar la reserva');
    }
  }

  /**
   * Vacía el carrito
   */
  clear() {
    console.log('Limpiando carrito...');
    this.items = [];
    this.total = 0;
    this.reservedDates.clear();
  }
}

/**
 * Obtiene y combina datos de ambas APIs
 * @returns {Promise<Array>} 
 */
async function fetchCombinedData() {
  console.log('Iniciando obtención de datos combinados...');
  
  try {
    console.log('Realizando peticiones a APIs...');
    const [imagesResponse, salonesResponse] = await Promise.all([
      fetch('https://api.pexels.com/v1/search?query=birthday&per_page=6', {
        headers: { 'Authorization': API_KEY }
      }),
      fetch('https://681a090f1ac1155635078a8f.mockapi.io/salones')
    ]);

    // Verificar respuestas
    if (!imagesResponse.ok) {
      throw new Error(`Error en API de imágenes: ${imagesResponse.status}`);
    }
    if (!salonesResponse.ok) {
      throw new Error(`Error en API de salones: ${salonesResponse.status}`);
    }

    console.log('Procesando respuestas...');
    const [imagesData, salonesData] = await Promise.all([
      imagesResponse.json(),
      salonesResponse.json()
    ]);

    // Verificar datos recibidos
    if (!imagesData.photos || !Array.isArray(imagesData.photos)) {
      throw new Error('Formato de datos de imágenes inválido');
    }
    if (!Array.isArray(salonesData)) {
      throw new Error('Formato de datos de salones inválido');
    }

    console.log('Datos de imágenes recibidos:', imagesData);
    console.log('Datos de salones recibidos:', salonesData);

    // Combinar datos
    const combinedData = salonesData.map((salon, index) => {
      const imageIndex = index % imagesData.photos.length;
      return {
        ...salon,
        imagen: imagesData.photos[imageIndex]?.src.medium || 'https://via.placeholder.com/300?text=Imagen+no+disponible'
      };
    }).slice(0, Math.min(salonesData.length, imagesData.photos.length));

    console.log('Datos combinados:', combinedData);
    return combinedData;

  } catch (error) {
    console.error('Error en fetchCombinedData:', error);
    throw error;
  }
}

/**
 * Renderiza el catálogo en el DOM
 * @param {Array} data - 
 */
function renderCatalog(data) {
  console.log('Iniciando renderizado del catálogo...');
  
  const container = document.getElementById('catalogo-container');
  if (!container) {
    console.error('Elemento con ID "catalogo-container" no encontrado en el DOM');
    throw new Error('Error al renderizar el catálogo');
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.warn('No hay datos para renderizar');
    container.innerHTML = '<div class="col-12 text-center py-5"><h4>No hay salones disponibles en este momento</h4></div>';
    return;
  }

  try {
    container.innerHTML = data.map(item => {
      
      if (!item.id || !item.nombre || !item.precio || !item.fecha) {
        console.warn('Item incompleto:', item);
        return '';
      }

      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${item.imagen || 'https://via.placeholder.com/300?text=Imagen+no+disponible'}" 
                 class="card-img-top" 
                 alt="${item.nombre}"
                 style="height: 200px; object-fit: cover;"
                 onerror="this.src='https://via.placeholder.com/300?text=Imagen+no+disponible'">
            <div class="card-body">
              <h5 class="card-title">${item.nombre}</h5>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-primary">Capacidad: ${item.capacidad || 'N/A'}</span>
                <h5 class="text-success mb-0">$${(item.precio || 0).toLocaleString('es-AR')}</h5>
              </div>
              <p class="mt-2"><small class="text-muted">Disponible en: ${item.fecha || 'Fecha no especificada'}</small></p>
              <button class="btn btn-primary w-100" 
                      onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <i class="bi bi-cart-plus"></i> Reservar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    console.log('Catálogo renderizado correctamente');
  } catch (error) {
    console.error('Error al renderizar catálogo:', error);
    container.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-danger">Error al cargar el catálogo</h4></div>';
  }
}

/**
 * Agrega un servicio al carrito
 * @param {Object} item - Servicio a agregar
 */
function addToCart(item) {
  console.log('Intentando agregar al carrito:', item);
  try {
    if (!window.cart) {
      throw new Error('El carrito no está inicializado');
    }
    
    cart.addItem({
      ...item,
      fecha: item.fecha
    });
    showAlert('¡Servicio agregado al carrito!', 'success');
    updateCartDisplay();
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    showAlert(error.message, 'danger');
  }
}

/**
 * Actualiza la visualización del carrito
 */
function updateCartDisplay() {
  console.log('Actualizando visualización del carrito...');
  
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  
  if (!cartItems || !totalElement) {
    console.error('Elementos del carrito no encontrados en el DOM');
    return;
  }

  if (!window.cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    cartItems.innerHTML = '<li class="list-group-item text-center text-muted">Tu carrito está vacío</li>';
    totalElement.textContent = '0';
    return;
  }

  try {
    cartItems.innerHTML = cart.items.map((item, index) => {
      if (!item.id || !item.nombre || !item.precio) {
        console.warn('Item del carrito inválido:', item);
        return '';
      }

      return `
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
      `;
    }).join('');
    
    totalElement.textContent = cart.total.toLocaleString('es-AR');
    console.log('Carrito actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
  }
}

/**
 * Muestra notificaciones al usuario
 * @param {string} message 
 * @param {string} type - 
 */
function showAlert(message, type = 'success') {
  console.log(`Mostrando alerta [${type}]: ${message}`);
  
  const alertContainer = document.getElementById('cart-alerts');
  if (!alertContainer) {
    console.error('Contenedor de alertas no encontrado');
    return;
  }

  try {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
      try {
        alert.remove();
      } catch (e) {
        console.error('Error al eliminar alerta:', e);
      }
    }, 3000);
  } catch (error) {
    console.error('Error al mostrar alerta:', error);
  }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM completamente cargado, iniciando aplicación...');
  
  try {
    // Verificar si hay una reserva previa en localStorage
    const savedReservation = localStorage.getItem('reserva');
    if (savedReservation) {
      console.log('Reserva previa encontrada:', savedReservation);
    }

    window.cart = new Cart();
    console.log('Obteniendo datos combinados...');
    const combinedData = await fetchCombinedData();
    
    console.log('Renderizando catálogo...');
    renderCatalog(combinedData);
    
    console.log('Actualizando carrito...');
    updateCartDisplay();
    
  } catch (error) {
    console.error('Error en inicialización:', error);
    showAlert('Error al cargar los datos. Por favor recarga la página.', 'danger');
    
    // Mostrar mensaje de error en el contenedor del catálogo
    const container = document.getElementById('catalogo-container');
    if (container) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <h4 class="text-danger">Error al cargar los datos</h4>
          <p class="text-muted">${error.message}</p>
          <button class="btn btn-primary mt-3" onclick="window.location.reload()">
            Recargar página
          </button>
        </div>
      `;
    }
  }
});