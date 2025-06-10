document.addEventListener('DOMContentLoaded', function() {
  // Variables globales para los totales
  let totalPrecios = 0;
  let totalReservas = 0;

  // Función  para mostrar las reservas
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
      const precio = parseFloat(reserva.precio) || 0;
      return total + precio;
    }, 0);
  }

  // Obtener todas las reservas del localStorage
  function obtenerTodasLasReservas() {
    try {
      // Intenta obtener de 'reservas_historial'
      const historial = localStorage.getItem('reservas_historial');
      if (historial) {
        return JSON.parse(historial);
      }
      
      // Si no existe, intenta con 'reservas' (formato antiguo)
      const reservasAntiguas = localStorage.getItem('reservas');
      return reservasAntiguas ? JSON.parse(reservasAntiguas) : [];
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
        <div class="alert alert-info">
          No hay reservas registradas.
        </div>
      `;
      return;
    }

    // Ordenar reservas por fecha de evento 
    reservas.sort((a, b) => new Date(b.fechaEvento) - new Date(a.fechaEvento));

    contenedor.innerHTML = reservas.map((reserva, index) => `
      <div class="card mb-4 reserva-card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-0">Reserva #${index + 1}</h5>
            <small class="text-muted">Acumulado: $${calcularAcumuladoHastaIndex(reservas, index).toFixed(2)}</small>
          </div>
          <span class="badge ${obtenerClaseEstado(reserva.estado)}">
            ${reserva.estado || 'confirmada'}
          </span>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6 class="text-primary">Información del Salón</h6>
              <p><strong>Nombre:</strong> ${reserva.salonNombre}</p>
              <p><strong>ID Salón:</strong> ${reserva.salonId}</p>
              <p><strong>Precio:</strong> $${(parseFloat(reserva.precio) || 0).toFixed(2)}</p>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary">Detalles de la Reserva</h6>
              <p><strong>Cliente:</strong> ${reserva.cliente}</p>
              <p><strong>Teléfono:</strong> ${reserva.telefono}</p>
              <p><strong>Personas:</strong> ${reserva.cantidadPersonas}</p>
              <p><strong>Fecha Evento:</strong> ${formatearFecha(reserva.fechaEvento)}</p>
              <p><strong>Fecha Registro:</strong> ${formatearFechaCompleta(reserva.fechaRegistro)}</p>
            </div>
          </div>
        </div>
        <div class="card-footer bg-light">
          <small class="text-muted">ID Reserva: ${reserva.id || 'N/A'}</small>
        </div>
      </div>
    `).join('');
  }

  // Calcular el acumulado hasta cierta reserva
  function calcularAcumuladoHastaIndex(reservas, index) {
    let acumulado = 0;
    for (let i = 0; i <= index; i++) {
      acumulado += parseFloat(reservas[i].precio) || 0;
    }
    return acumulado;
  }

  // Actualizar los contadores
  function actualizarContadores() {
    const contadorReservas = document.getElementById('total-reservas');
    const contadorPrecios = document.getElementById('total-precios');
    
    if (contadorReservas) {
      contadorReservas.innerHTML = `
        <i class="bi bi-calendar-check"></i> Total de reservas: <strong>${totalReservas}</strong>
      `;
    }
    
    if (contadorPrecios) {
      contadorPrecios.innerHTML = `
        <i class="bi bi-cash-stack"></i> Valor total: <strong>$${totalPrecios.toFixed(2)}</strong>
      `;
    }
  }

  // Funciones auxiliares
  function formatearFecha(fecha) {
    if (!fecha) return 'No especificada';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }

  function formatearFechaCompleta(fecha) {
    if (!fecha) return 'No especificada';
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }

  function obtenerClaseEstado(estado) {
    switch (estado) {
      case 'confirmada':
        return 'bg-success';
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'cancelada':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  // Inicializar
  mostrarReservas();
});