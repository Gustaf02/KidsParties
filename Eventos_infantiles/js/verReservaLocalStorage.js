document.addEventListener('DOMContentLoaded', function() {
  // Variables globales para los totales
  let totalPrecios = 0;
  let totalReservas = 0;

  // Función principal para mostrar las reservas
  function mostrarReservas() {
    const reservas = obtenerTodasLasReservas();
    totalReservas = reservas.length;
    totalPrecios = calcularTotalPrecios(reservas);
    renderizarReservas(reservas);
    actualizarContadores();
  }

  // Calcular la suma de todos los precios
  function calcularTotalPrecios(reservas) {
    return reservas.reduce((total, reserva) => {
      
      const precio = parseFloat(reserva.precioTotal || reserva.precio) || 0;
      return total + precio;
    }, 0);
  }

  // Obtener todas las reservas del localStorage
  function obtenerTodasLasReservas() {
    try {
      
      const reservasNuevas = localStorage.getItem('reservas');
      if (reservasNuevas) {
        return JSON.parse(reservasNuevas);
      }
      
      const historial = localStorage.getItem('reservas_historial');
      return historial ? JSON.parse(historial) : [];
    } catch (error) {
      console.error('Error al leer reservas:', error);
      return [];
    }
  }

  // Renderizar las reservas en el DOM 
  function renderizarReservas(reservas) {
    const contenedor = document.getElementById('reservas-container');
    if (!reservas || reservas.length === 0) {
      contenedor.innerHTML = `
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle-fill me-2"></i>No hay reservas registradas todavía.
        </div>
      `;
      return;
    }

    // Ordenar reservas por fecha de evento más reciente primero
    reservas.sort((a, b) => new Date(b.fechaEvento) - new Date(a.fechaEvento));

    contenedor.innerHTML = reservas.map((reserva) => `
      <div class="card reserva-card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <span class="fw-bold">Salón:</span> ${reserva.salonNombre}
            <small class="text-muted d-block">ID Reserva: ${reserva.id ? `#${reserva.id.slice(-6)}` : 'N/A'}</small>
          </div>
          <span class="badge ${obtenerClaseEstado(reserva.estado)}">
            ${reserva.estado || 'Confirmada'}
          </span>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3 mb-md-0">
              <h6 class="text-primary fw-bold"><i class="bi bi-person-fill me-2"></i>Información del Cliente</h6>
              <p class="mb-1"><strong>Nombre:</strong> ${reserva.cliente}</p>
              <p class="mb-0"><strong>Teléfono:</strong> ${reserva.telefono}</p>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary fw-bold"><i class="bi bi-calendar-event-fill me-2"></i>Detalles del Evento</h6>
              <p class="mb-1"><strong>Fecha:</strong> ${formatearFecha(reserva.fechaEvento)}</p>
              <p class="mb-1"><strong>N° Personas:</strong> ${reserva.cantidadPersonas}</p>
              <p class="mb-0"><strong>Precio Total:</strong> $${(parseFloat(reserva.precioTotal || reserva.precio) || 0).toFixed(2)}</p>
            </div>
          </div>
          
          ${reserva.precioDesglose ? `
          <div class="row mt-3">
            <div class="col-12">
              <h6 class="text-primary fw-bold"><i class="bi bi-receipt me-2"></i>Desglose de Precios</h6>
              <table class="table table-sm">
                <tbody>
                  <tr>
                    <td>Precio Base:</td>
                    <td class="text-end">$${reserva.precioDesglose.base.toFixed(2)}</td>
                  </tr>
                  ${reserva.servicios && reserva.servicios.length > 0 ? reserva.servicios.map(servicio => `
                    <tr>
                      <td>${servicio.nombre}:</td>
                      <td class="text-end">$${servicio.costo}</td>
                    </tr>
                  `).join('') : ''}
                  <tr class="table-active fw-bold">
                    <td>Total:</td>
                    <td class="text-end">$${reserva.precioDesglose.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}
          
          ${reserva.servicios && reserva.servicios.length > 0 && !reserva.precioDesglose ? `
          <div class="row mt-3">
            <div class="col-12">
              <h6 class="text-primary fw-bold"><i class="bi bi-list-check me-2"></i>Servicios Adicionales</h6>
              <ul class="list-group list-group-flush">
                ${reserva.servicios.map(servicio => `
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${servicio.nombre}
                    <span class="badge bg-primary rounded-pill">$${servicio.costo}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
          ` : ''}
        </div>
        <div class="card-footer bg-light text-muted text-end">
          <small>Reserva registrada el: ${formatearFechaCompleta(reserva.fechaRegistro)}</small>
        </div>
      </div>
    `).join('');
  }

  // Actualizar los contadores 
  function actualizarContadores() {
    const contadorReservasCard = document.getElementById('total-reservas-card');
    const contadorPreciosCard = document.getElementById('total-precios-card');

    if (contadorReservasCard) {
      contadorReservasCard.innerHTML = `
        <i class="bi bi-calendar2-check"></i>
        <div>
          <p class="card-text mb-0">Total de Reservas</p>
          <h4 class="card-title">${totalReservas}</h4>
        </div>
      `;
    }

    if (contadorPreciosCard) {
      contadorPreciosCard.innerHTML = `
        <i class="bi bi-cash-coin"></i>
        <div>
          <p class="card-text mb-0">Ingresos Totales Estimados</p>
          <h4 class="card-title">$${totalPrecios.toFixed(2)}</h4>
        </div>
      `;
    }
  }

  // Funciones auxiliares 
  function formatearFecha(fecha) {
    if (!fecha) return 'No especificada';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }

  function formatearFechaCompleta(fecha) {
    if (!fecha) return 'No especificada';
    const opciones = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(fecha).toLocaleString('es-ES', opciones);
  }

  function obtenerClaseEstado(estado) {
    switch (estado) {
      case 'confirmada': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  // Inicializar la aplicación
  mostrarReservas();
});