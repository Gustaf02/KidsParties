document.addEventListener('DOMContentLoaded', function() {
    let totalPresupuestos = 0;
    let montoTotal = 0;

    function mostrarPresupuestos() {
        const presupuestos = obtenerTodosLosPresupuestos();
        totalPresupuestos = presupuestos.length;
        montoTotal = calcularMontoTotal(presupuestos);
        renderizarPresupuestos(presupuestos);
        actualizarContadores();
    }

    function calcularMontoTotal(presupuestos) {
        return presupuestos.reduce((total, presupuesto) => {
            const precio = parseFloat(presupuesto.precioTotal || presupuesto.precio) || 0;
            return total + precio;
        }, 0);
    }

    function obtenerTodosLosPresupuestos() {
        try {
            const items = localStorage.getItem('reservas');
            if (items) {
                return JSON.parse(items).filter(item => item.estado === 'presupuesto');
            }
            return [];
        } catch (error) {
            console.error('Error al leer los presupuestos:', error);
            return [];
        }
    }

    function renderizarPresupuestos(presupuestos) {
        const contenedor = document.getElementById('presupuesto-container');
        if (!presupuestos || presupuestos.length === 0) {
            contenedor.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle-fill me-2"></i>No hay presupuestos registrados todavía.
                </div>`;
            return;
        }

        presupuestos.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        contenedor.innerHTML = presupuestos.map((presupuesto) => `
            <div class="card reserva-card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">Salón:</span> ${presupuesto.salonNombre}
                        <small class="text-muted d-block">ID Presupuesto: ${presupuesto.id ? `#${presupuesto.id.slice(-6)}` : 'N/A'}</small>
                    </div>
                    <span class="badge bg-info text-dark">
                        ${presupuesto.estado.charAt(0).toUpperCase() + presupuesto.estado.slice(1)}
                    </span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3 mb-md-0">
                            <h6 class="text-primary fw-bold"><i class="bi bi-person-fill me-2"></i>Información del Cliente</h6>
                            <p class="mb-1"><strong>Nombre:</strong> ${presupuesto.cliente}</p>
                            <p class="mb-1"><strong>Email:</strong> ${presupuesto.email}</p>
                            <p class="mb-0"><strong>Teléfono:</strong> ${presupuesto.telefono}</p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-primary fw-bold"><i class="bi bi-file-earmark-text-fill me-2"></i>Detalles del Presupuesto</h6>
                            <p class="mb-1"><strong>N° Personas:</strong> ${presupuesto.cantidadPersonas}</p>
                            <p class="mb-0"><strong>Monto Total:</strong> $${(parseFloat(presupuesto.precioTotal || presupuesto.precio) || 0).toFixed(2)}</p>
                        </div>
                    </div>
                    ${presupuesto.precioDesglose ? `
                    <div class="row mt-3">
                        <div class="col-12">
                            <h6 class="text-primary fw-bold"><i class="bi bi-receipt me-2"></i>Desglose de Precios</h6>
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td>Precio Base:</td>
                                        <td class="text-end">$${presupuesto.precioDesglose.base.toFixed(2)}</td>
                                    </tr>
                                    ${presupuesto.servicios && presupuesto.servicios.length > 0 ? presupuesto.servicios.map(servicio => `
                                    <tr>
                                        <td>${servicio.nombre}:</td>
                                        <td class="text-end">$${servicio.costo}</td>
                                    </tr>`).join('') : ''}
                                    <tr class="table-active fw-bold">
                                        <td>Total:</td>
                                        <td class="text-end">$${presupuesto.precioDesglose.total.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>` : ''}
                </div>
                <div class="card-footer bg-light text-muted text-end">
                    <small>Presupuesto solicitado el: ${formatearFechaCompleta(presupuesto.fechaRegistro)}</small>
                </div>
            </div>
        `).join('');
    }

    function actualizarContadores() {
        const contadorPresupuestosCard = document.getElementById('total-reservas-card');
        const contadorMontosCard = document.getElementById('total-precios-card');

        if (contadorPresupuestosCard) {
            contadorPresupuestosCard.innerHTML = `
                <i class="bi bi-file-text-fill"></i>
                <div>
                    <p class="card-text mb-0">Total de Presupuestos</p>
                    <h4 class="card-title">${totalPresupuestos}</h4>
                </div>`;
        }
        if (contadorMontosCard) {
            contadorMontosCard.innerHTML = `
                <i class="bi bi-calculator-fill"></i>
                <div>
                    <p class="card-text mb-0">Montos Totales Estimados</p>
                    <h4 class="card-title">$${montoTotal.toFixed(2)}</h4>
                </div>`;
        }
    }

    function formatearFechaCompleta(fecha) {
        if (!fecha) return 'No especificada';
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(fecha).toLocaleString('es-ES', opciones);
    }

    mostrarPresupuestos();
});